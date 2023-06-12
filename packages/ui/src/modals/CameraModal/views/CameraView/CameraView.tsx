import * as React from 'react';

import { AppTheme, useTheme } from '../../../../theme';
import {
  Camera,
  CameraDeviceFormat,
  CameraRuntimeError,
  FrameProcessorPerformanceSuggestion,
  frameRateIncluded,
  sortFormats,
  useCameraDevices,
} from 'react-native-vision-camera';
import type { CameraViewMethods, CameraViewProps } from './types';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';
import { useCallback, useMemo, useRef, useState } from 'react';

import { CaptureButton } from './CaptureButton';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';
import { log } from '@react-native-ajp-elements/core';
import { makeStyles } from '@rneui/themed';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/core';
import { useIsForeground } from '../../../../hooks/useIsForeground';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const buttonSize = 40;
const maxZoomFactor = 20;
const scaleFullZoom = 3;

type CameraView = CameraViewMethods;

const CameraView = React.forwardRef<CameraView, CameraViewProps>(
  (props, _ref) => {
    const { onMediaCaptured } = props;
    const theme = useTheme();
    const s = useStyles(theme);

    const camera = useRef<Camera>(null);
    const [isCameraInitialized, setIsCameraInitialized] = useState(false);
    const [hasMicrophonePermission, setHasMicrophonePermission] =
      useState(false);
    const zoom = useSharedValue(0);
    const isPressingButton = useSharedValue(false);

    // Check if camera page is active
    const isFocussed = useIsFocused();
    const isForeground = useIsForeground();
    const isActive = isFocussed && isForeground;

    const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
      'back',
    );
    const [enableHdr, setEnableHdr] = useState(false);
    const [flash, setFlash] = useState<'off' | 'on'>('off');
    const [enableNightMode, setEnableNightMode] = useState(false);

    // Camera format settings
    const devices = useCameraDevices();
    const device = devices[cameraPosition];
    const formats = useMemo<CameraDeviceFormat[]>(() => {
      if (device?.formats == null) return [];
      return device.formats.sort(sortFormats);
    }, [device?.formats]);

    //#region Memos
    const [is60Fps, setIs60Fps] = useState(true);

    const fps = useMemo(() => {
      if (!is60Fps) return 30;

      if (enableNightMode && !device?.supportsLowLightBoost) {
        // User has enabled Night Mode, but Night Mode is not natively supported, so we simulate it by lowering the frame rate.
        return 30;
      }

      const supportsHdrAt60Fps = formats.some(
        f =>
          f.supportsVideoHDR &&
          f.frameRateRanges.some(r => frameRateIncluded(r, 60)),
      );

      if (enableHdr && !supportsHdrAt60Fps) {
        // User has enabled HDR, but HDR is not supported at 60 FPS.
        return 30;
      }

      const supports60Fps = formats.some(f =>
        f.frameRateRanges.some(r => frameRateIncluded(r, 60)),
      );

      if (!supports60Fps) {
        // 60 FPS is not supported by any format.
        return 30;
      }
      // If nothing blocks us from using it, we default to 60 FPS.
      return 60;
    }, [
      device?.supportsLowLightBoost,
      enableHdr,
      enableNightMode,
      formats,
      is60Fps,
    ]);

    const supportsCameraFlipping = useMemo(
      () => devices.back != null && devices.front != null,
      [devices.back, devices.front],
    );

    const supportsFlash = device?.hasFlash ?? false;

    const supportsHdr = useMemo(
      () => formats.some(f => f.supportsVideoHDR || f.supportsPhotoHDR),
      [formats],
    );

    const supports60Fps = useMemo(
      () =>
        formats.some(f =>
          f.frameRateRanges.some(rate => frameRateIncluded(rate, 60)),
        ),
      [formats],
    );

    const canToggleNightMode = enableNightMode
      ? true // It's enabled so you have to be able to turn it off again
      : (device?.supportsLowLightBoost ?? false) || fps > 30; // either we have native support, or we can lower the FPS
    //#endregion

    const format = useMemo(() => {
      let result = formats;
      if (enableHdr) {
        // We only filter by HDR capable formats if HDR is set to true.
        // Otherwise we ignore the `supportsVideoHDR` property and accept formats which support HDR `true` or `false`
        result = result.filter(f => f.supportsVideoHDR || f.supportsPhotoHDR);
      }

      // find the first format that includes the given FPS
      return result.find(f =>
        f.frameRateRanges.some(r => frameRateIncluded(r, fps)),
      );
    }, [formats, fps, enableHdr]);

    //#region Animated Zoom
    // This just maps the zoom factor to a percentage value.
    // So e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
    const minZoom = device?.minZoom ?? 1;
    const maxZoom = Math.min(device?.maxZoom ?? 1, maxZoomFactor);

    const cameraAnimatedProps = useAnimatedProps(() => {
      const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
      return {
        zoom: z,
      };
    }, [maxZoom, minZoom, zoom]);
    //#endregion

    //#region Callbacks
    const setIsPressingButton = useCallback(
      (_isPressingButton: boolean) => {
        isPressingButton.value = _isPressingButton;
      },
      [isPressingButton],
    );

    // Camera callbacks
    const onError = useCallback((error: CameraRuntimeError) => {
      log.debug(error);
    }, []);

    const onInitialized = useCallback(() => {
      log.debug('Camera initialized!');
      setIsCameraInitialized(true);
    }, []);

    const onFlipCameraPressed = useCallback(() => {
      setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
    }, []);

    const onFlashPressed = useCallback(() => {
      setFlash(f => (f === 'off' ? 'on' : 'off'));
    }, []);
    //#endregion

    //#region Tap Gesture
    const onDoubleTap = useCallback(() => {
      onFlipCameraPressed();
    }, [onFlipCameraPressed]);
    //#endregion

    //#region Effects
    const neutralZoom = device?.neutralZoom ?? 1;

    useEffect(() => {
      // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
      zoom.value = neutralZoom;
    }, [neutralZoom, zoom]);

    useEffect(() => {
      Camera.getMicrophonePermissionStatus().then(status =>
        setHasMicrophonePermission(status === 'authorized'),
      );
    }, []);
    //#endregion

    //#region Pinch to Zoom Gesture
    // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
    // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
    const onPinchGesture = useAnimatedGestureHandler<
      PinchGestureHandlerGestureEvent,
      { startZoom?: number }
    >({
      onStart: (_, context) => {
        context.startZoom = zoom.value;
      },
      onActive: (event, context) => {
        // We're trying to map the scale gesture to a linear zoom here
        const startZoom = context.startZoom ?? 0;
        const scale = interpolate(
          event.scale,
          [1 - 1 / scaleFullZoom, 1, scaleFullZoom],
          [-1, 0, 1],
          Extrapolate.CLAMP,
        );
        zoom.value = interpolate(
          scale,
          [-1, 0, 1],
          [minZoom, startZoom, maxZoom],
          Extrapolate.CLAMP,
        );
      },
    });
    //#endregion

    if (device != null && format != null) {
      log.debug(
        `Re-rendering camera page with ${
          isActive ? 'active' : 'inactive'
        } camera. ` +
          `Device: "${device.name}" (${format.photoWidth}x${format.photoHeight} @ ${fps}fps)`,
      );
    } else {
      log.debug('Re-rendering camera page without active camera');
    }

    const onFrameProcessorSuggestionAvailable = useCallback(
      (suggestion: FrameProcessorPerformanceSuggestion) => {
        log.debug(
          `Suggestion available! ${suggestion.type}: Can do ${suggestion.suggestedFrameProcessorFps} FPS`,
        );
      },
      [],
    );

    return (
      <View style={s.container}>
        {device != null && (
          <PinchGestureHandler
            onGestureEvent={onPinchGesture}
            enabled={isActive}>
            <Reanimated.View style={StyleSheet.absoluteFill}>
              <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
                <ReanimatedCamera
                  ref={camera}
                  style={StyleSheet.absoluteFill}
                  device={device}
                  format={format}
                  fps={fps}
                  hdr={enableHdr}
                  lowLightBoost={
                    device.supportsLowLightBoost && enableNightMode
                  }
                  isActive={isActive}
                  onInitialized={onInitialized}
                  onError={onError}
                  enableZoomGesture={false}
                  animatedProps={cameraAnimatedProps}
                  photo={true}
                  video={true}
                  audio={hasMicrophonePermission}
                  orientation={'device'}
                  frameProcessorFps={1}
                  onFrameProcessorPerformanceSuggestionAvailable={
                    onFrameProcessorSuggestionAvailable
                  }
                />
              </TapGestureHandler>
            </Reanimated.View>
          </PinchGestureHandler>
        )}

        <CaptureButton
          style={s.captureButton}
          camera={camera}
          onMediaCaptured={onMediaCaptured}
          cameraZoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          flash={supportsFlash ? flash : 'off'}
          enabled={isCameraInitialized && isActive}
          setIsPressingButton={setIsPressingButton}
        />

        <View style={s.rightButtonRow}>
          {supportsCameraFlipping && (
            <TouchableOpacity style={s.button} onPress={onFlipCameraPressed}>
              <IonIcon name="camera-reverse" color="white" size={24} />
            </TouchableOpacity>
          )}
          {supportsFlash && (
            <TouchableOpacity style={s.button} onPress={onFlashPressed}>
              <IonIcon
                name={flash === 'on' ? 'flash' : 'flash-off'}
                color="white"
                size={24}
              />
            </TouchableOpacity>
          )}
          {supports60Fps && (
            <TouchableOpacity
              style={s.button}
              onPress={() => setIs60Fps(!is60Fps)}>
              <Text style={s.text}>
                {is60Fps ? '60' : '30'}
                {'\n'}FPS
              </Text>
            </TouchableOpacity>
          )}
          {supportsHdr && (
            <TouchableOpacity
              style={s.button}
              onPress={() => setEnableHdr(h => !h)}>
              <MaterialIcon
                name={enableHdr ? 'hdr' : 'hdr-off'}
                color="white"
                size={24}
              />
            </TouchableOpacity>
          )}
          {canToggleNightMode && (
            <TouchableOpacity
              style={s.button}
              onPress={() => setEnableNightMode(!enableNightMode)}>
              <IonIcon
                name={enableNightMode ? 'moon' : 'moon-outline'}
                color="white"
                size={24}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.stickyBlack,
    borderRadius: 20,
    overflow: 'hidden',
    height: '100%',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: theme.insets.bottom,
  },
  button: {
    marginBottom: 15,
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: theme.colors.blackTransparentMid,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: 15,
    top: '30%',
  },
  text: {
    ...theme.styles.textTiny,
    ...theme.styles.textBold,
    color: theme.colors.stickyWhite,
    textAlign: 'center',
  },
}));

export default CameraView;
