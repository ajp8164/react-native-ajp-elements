// See https://github.com/mrousavy/react-native-vision-camera/blob/main/example/src/CameraPage.tsx

import * as React from 'react';

import { AppTheme, useTheme, viewport } from '../../../../theme';
import {
  Camera,
  CameraProps,
  CameraRuntimeError,
  useCameraDevice,
  useCameraFormat,
  useLocationPermission,
  useMicrophonePermission,
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
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native';
import { useCallback, useMemo, useRef, useState } from 'react';

import { CaptureButton } from './CaptureButton';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';
import { log } from '@react-native-ajp-elements/core';
import { makeStyles } from '@rn-vui/themed';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/core';
import { useIsForeground } from '../../../../hooks/useIsForeground';
import { usePreferredCameraDevice } from './hooks/usePreferredCameraDevice';

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
    const microphone = useMicrophonePermission();
    const location = useLocationPermission();
    const zoom = useSharedValue(1);
    const isPressingButton = useSharedValue(false);
  
    // check if camera page is active
    const isFocussed = useIsFocused();
    const isForeground = useIsForeground();
    const isActive = isFocussed && isForeground;
  
    const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
    const [enableHdr, setEnableHdr] = useState(false);
    const [flash, setFlash] = useState<'off' | 'on'>('off');
    const [enableNightMode, setEnableNightMode] = useState(false);
  
    // camera device settings
    const [preferredDevice] = usePreferredCameraDevice();
    let device = useCameraDevice(cameraPosition);
  
    if (preferredDevice != null && preferredDevice.position === cameraPosition) {
      // override default device with the one selected by the user in settings
      device = preferredDevice
    }
  
    const [targetFps, setTargetFps] = useState(60);
  
    const screenAspectRatio = viewport.height / viewport.width;
    const format = useCameraFormat(device, [
      { fps: targetFps },
      { videoAspectRatio: screenAspectRatio },
      { videoResolution: 'max' },
      { photoAspectRatio: screenAspectRatio },
      { photoResolution: 'max' },
    ]);
  
    const fps = Math.min(format?.maxFps ?? 1, targetFps);
  
    const supportsFlash = device?.hasFlash ?? false;
    const supportsHdr = format?.supportsPhotoHdr;
    const supports60Fps = useMemo(() => device?.formats.some((f) => f.maxFps >= 60), [device?.formats]);
    const canToggleNightMode = device?.supportsLowLightBoost ?? false;
  
    //#region Animated Zoom
    const minZoom = device?.minZoom ?? 1;
    const maxZoom = Math.min(device?.maxZoom ?? 1, maxZoomFactor);
  
    const cameraAnimatedProps = useAnimatedProps<CameraProps>(() => {
      const z = Math.max(Math.min(zoom.value, maxZoom), minZoom)
      return {
        zoom: z,
      }
    }, [maxZoom, minZoom, zoom]);
    //#endregion
  
    //#region Callbacks
    const setIsPressingButton = useCallback(
      (_isPressingButton: boolean) => {
        isPressingButton.value = _isPressingButton
      },
      [isPressingButton],
    );

    const onError = useCallback((error: CameraRuntimeError) => {
      console.error(error)
    }, []);

    const onInitialized = useCallback(() => {
      log.debug('Camera initialized!');
      setIsCameraInitialized(true)
    }, []);

    const onFlipCameraPressed = useCallback(() => {
      setCameraPosition((p) => (p === 'back' ? 'front' : 'back'))
    }, []);

    const onFlashPressed = useCallback(() => {
      setFlash((f) => (f === 'off' ? 'on' : 'off'))
    }, []);
    //#endregion
  
    //#region Tap Gesture
    const onFocusTap = useCallback(
      ({ nativeEvent: event }: GestureResponderEvent) => {
        if (!device?.supportsFocus) return
        camera.current?.focus({
          x: event.locationX,
          y: event.locationY,
        })
      },
      [device?.supportsFocus],
    );

    const onDoubleTap = useCallback(() => {
      onFlipCameraPressed()
    }, [onFlipCameraPressed]);
    //#endregion
  
    //#region Effects
    useEffect(() => {
      // Reset zoom to it's default everytime the `device` changes.
      zoom.value = device?.neutralZoom ?? 1
    }, [zoom, device]);
    //#endregion
  
    //#region Pinch to Zoom Gesture
    // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
    // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
    const onPinchGesture = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { startZoom?: number }>({
      onStart: (_, context) => {
        context.startZoom = zoom.value
      },
      onActive: (event, context) => {
        // we're trying to map the scale gesture to a linear zoom here
        const startZoom = context.startZoom ?? 0
        const scale = interpolate(event.scale, [1 - 1 / scaleFullZoom, 1, scaleFullZoom], [-1, 0, 1], Extrapolate.CLAMP)
        zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP)
      },
    });
    //#endregion
  
    useEffect(() => {
      const f =
        format != null
          ? `(${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight}@${format.maxFps} video @ ${fps}fps)`
          : undefined;
      log.debug(`Camera: ${device?.name} | Format: ${f}`);
    }, [device?.name, format, fps]);
  
    useEffect(() => {
      location.requestPermission();
    }, [location]);
  
    const videoHdr = format?.supportsVideoHdr && enableHdr;
    const photoHdr = format?.supportsPhotoHdr && enableHdr && !videoHdr;
  
    return (
      <View style={s.container}>
        {device != null && (
          <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
            <Reanimated.View onTouchEnd={onFocusTap} style={StyleSheet.absoluteFill}>
              <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
                <ReanimatedCamera
                  style={StyleSheet.absoluteFill}
                  device={device}
                  isActive={isActive}
                  ref={camera}
                  onInitialized={onInitialized}
                  onError={onError}
                  onStarted={() => console.log('Camera started!')}
                  onStopped={() => console.log('Camera stopped!')}
                  onPreviewStarted={() => console.log('Preview started!')}
                  onPreviewStopped={() => console.log('Preview stopped!')}
                  onOutputOrientationChanged={(o) => console.log(`Output orientation changed to ${o}!`)}
                  onPreviewOrientationChanged={(o) => console.log(`Preview orientation changed to ${o}!`)}
                  onUIRotationChanged={(degrees) => console.log(`UI Rotation changed: ${degrees}°`)}
                  format={format}
                  fps={fps}
                  photoHdr={photoHdr}
                  videoHdr={videoHdr}
                  photoQualityBalance="quality"
                  lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                  enableZoomGesture={false}
                  animatedProps={cameraAnimatedProps}
                  exposure={0}
                  enableFpsGraph={true}
                  outputOrientation="device"
                  photo={true}
                  video={true}
                  audio={microphone.hasPermission}
                  enableLocation={location.hasPermission}
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
          <TouchableOpacity style={s.button} onPress={onFlipCameraPressed}>
            <IonIcon name="camera-reverse" color="white" size={24} />
          </TouchableOpacity>
          {supportsFlash && (
            <TouchableOpacity style={s.button} onPress={onFlashPressed} >
              <IonIcon name={flash === 'on' ? 'flash' : 'flash-off'} color="white" size={24} />
            </TouchableOpacity>
          )}
          {supports60Fps && (
            <TouchableOpacity style={s.button} onPress={() => setTargetFps((t) => (t === 30 ? 60 : 30))}>
              <Text style={s.text}>{`${targetFps}\nFPS`}</Text>
            </TouchableOpacity>
          )}
          {supportsHdr && (
            <TouchableOpacity style={s.button} onPress={() => setEnableHdr((h) => !h)}>
              <MaterialIcon name={enableHdr ? 'hdr' : 'hdr-off'} color="white" size={24} />
            </TouchableOpacity>
          )}
          {canToggleNightMode && (
            <TouchableOpacity style={s.button} onPress={() => setEnableNightMode(!enableNightMode)}>
              <IonIcon name={enableNightMode ? 'moon' : 'moon-outline'} color="white" size={24} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    )    
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
