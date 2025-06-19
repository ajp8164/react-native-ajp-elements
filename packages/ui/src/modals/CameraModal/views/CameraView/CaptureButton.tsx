import { type AppTheme, useTheme, viewport } from '../../../../theme';
import type {
  Camera,
  TakePhotoOptions,
  TakeSnapshotOptions,
} from 'react-native-vision-camera';
import type { MediaType, PhotoFile, VideoFile } from './types';
import {
  Gesture,
  GestureDetector,
  // GestureStateChangeEvent,
  // PanGestureHandler,
  type PanGestureHandlerGestureEvent,
  State,
  // TapGestureHandler,
  type TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import React, { useCallback, useMemo, useRef } from 'react';
import Reanimated, {
  Easing,
  Extrapolate,
  cancelAnimation,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Text, View, type ViewProps } from 'react-native';

import { log } from '@react-native-ajp-elements/core';
import { makeStyles } from '@rn-vui/themed';
// import { Gesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';

const captureButtonSize = 85;
// const panGestureHandlerFailX = [-viewport.width, viewport.width];
// const panGestureHandlerActiveY = [-2, 2];
const startRecordingDelay = 200;

interface Props extends ViewProps {
  camera: React.RefObject<Camera | null>;
  onMediaCaptured: (media: PhotoFile | VideoFile, type: MediaType) => void;
  minZoom: number;
  maxZoom: number;
  cameraZoom: Reanimated.SharedValue<number>;
  flash: 'off' | 'on';
  enabled: boolean;
  setIsPressingButton: (isPressingButton: boolean) => void;
}

const _CaptureButton: React.FC<Props> = ({
  camera,
  onMediaCaptured,
  minZoom,
  maxZoom,
  cameraZoom,
  flash,
  enabled,
  setIsPressingButton,
  style,
  ...props
}): React.ReactElement => {
  const theme = useTheme();
  const s = useStyles(theme);

  const pressDownDate = useRef<Date | undefined>(undefined);
  const isRecording = useRef(false);
  const recordingProgress = useSharedValue(0);
  const takePhotoOptions = useMemo<TakePhotoOptions & TakeSnapshotOptions>(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'speed',
      flash: flash,
      quality: 90,
      skipMetadata: true,
    }),
    [flash],
  );
  const isPressingButton = useSharedValue(false);

  //#region Camera Capture
  const takePhoto = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      log.debug('Taking photo...');
      const photo = await camera.current.takePhoto(takePhotoOptions);
      if (!photo.path.includes('file://')) {
        photo.path = `file://${photo.path}`;
      }
      onMediaCaptured(photo, 'photo');
    } catch (e) {
      log.debug('Failed to take photo!', e);
    }
  }, [camera, onMediaCaptured, takePhotoOptions]);

  const onStoppedRecording = useCallback(() => {
    isRecording.current = false;
    cancelAnimation(recordingProgress);
    log.debug('Stopped recording video!');
  }, [recordingProgress]);

  const stopRecording = useCallback(async () => {
    try {
      if (camera.current == null) {
        throw new Error('Camera ref is null!');
      }

      log.debug('Calling stopRecording()...');
      await camera.current.stopRecording();
      log.debug('Called stopRecording()!');
    } catch (e) {
      log.debug('Failed to stop recording!', e);
    }
  }, [camera]);

  const startRecording = useCallback(() => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      log.debug('Calling startRecording()...');
      camera.current.startRecording({
        flash: flash,
        onRecordingError: error => {
          log.debug('Recording failed!', error);
          onStoppedRecording();
        },
        onRecordingFinished: video => {
          log.debug(`Recording successfully finished! ${video.path}`);
          const v: VideoFile = {
            ...video,
            width: 0, // Size will be discovered later during media load.
            height: 0,
          };
          onMediaCaptured(v, 'video');
          onStoppedRecording();
        },
      });
      // TODO: wait until startRecording returns to actually find out if the recording has successfully started
      log.debug('Called startRecording()!');
      isRecording.current = true;
    } catch (e) {
      log.debug('Failed to start recording!', e, 'camera');
    }
  }, [camera, flash, onMediaCaptured, onStoppedRecording]);
  //#endregion

  //#region Tap handler
  // const tapHandler = useRef(null);
  const onHandlerStateChanged = useCallback(
    async ({ nativeEvent: event }: TapGestureHandlerStateChangeEvent) => {
      // This is the gesture handler for the circular "shutter" button.
      // Once the finger touches the button (State.BEGAN), a photo is being taken and "capture mode" is entered. (disabled tab bar)
      // Also, we set `pressDownDate` to the time of the press down event, and start a 200ms timeout. If the `pressDownDate` hasn't changed
      // after the 200ms, the user is still holding down the "shutter" button. In that case, we start recording.
      //
      // Once the finger releases the button (State.END/FAILED/CANCELLED), we leave "capture mode" (enable tab bar) and check the `pressDownDate`,
      // if `pressDownDate` was less than 200ms ago, we know that the intention of the user is to take a photo. We check the `takePhotoPromise` if
      // there already is an ongoing (or already resolved) takePhoto() call (remember that we called takePhoto() when the user pressed down), and
      // if yes, use that. If no, we just try calling takePhoto() again
      log.debug(`State: ${Object.keys(State)[event.state]}`);
      switch (event.state) {
        case State.BEGAN: {
          // Enter "recording mode"
          recordingProgress.value = 0;
          isPressingButton.value = true;
          const now = new Date();
          pressDownDate.current = now;
          setTimeout(() => {
            if (pressDownDate.current === now) {
              // User is still pressing down after 200ms, so his intention is to create a video
              startRecording();
            }
          }, startRecordingDelay);
          setIsPressingButton(true);
          return;
        }
        case State.END:
        case State.FAILED:
        case State.CANCELLED: {
          // Exit "recording mode"
          try {
            if (pressDownDate.current == null)
              throw new Error('PressDownDate ref .current was null!');
            const now = new Date();
            const diff = now.getTime() - pressDownDate.current.getTime();
            pressDownDate.current = undefined;
            if (diff < startRecordingDelay) {
              // User has released the button within 200ms, so his intention is to take a single picture.
              await takePhoto();
            } else {
              // User has held the button for more than 200ms, so he has been recording this entire time.
              await stopRecording();
            }
          } finally {
            setTimeout(() => {
              isPressingButton.value = false;
              setIsPressingButton(false);
            }, 500);
          }
          return;
        }
        default:
          break;
      }
    },
    [
      isPressingButton,
      recordingProgress,
      setIsPressingButton,
      startRecording,
      stopRecording,
      takePhoto,
    ],
  );
  //#endregion

  //#region Pan handler
  // const panHandler = useRef(null);
  const onPanGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetY?: number; startY?: number }
  >({
    onStart: (event, context) => {
      context.startY = event.absoluteY;
      const yForFullZoom = context.startY * 0.7;
      const offsetYForFullZoom = context.startY - yForFullZoom;

      // Extrapolate [0 ... 1] zoom -> [0 ... offsetYForFullZoom] finger position
      context.offsetY = interpolate(
        cameraZoom.value,
        [minZoom, maxZoom],
        [0, offsetYForFullZoom],
        Extrapolate.CLAMP,
      );
    },
    onActive: (event, context) => {
      const offset = context.offsetY ?? 0;
      const startY = context.startY ?? viewport.height;
      const yForFullZoom = startY * 0.7;

      cameraZoom.value = interpolate(
        event.absoluteY - offset,
        [yForFullZoom, startY],
        [maxZoom, minZoom],
        Extrapolate.CLAMP,
      );
    },
  });
  //#endregion

  const shadowStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withSpring(isPressingButton.value ? 1 : 0, {
            mass: 1,
            damping: 35,
            stiffness: 300,
          }),
        },
      ],
    }),
    [isPressingButton],
  );

  const buttonStyle = useAnimatedStyle(() => {
    let scale: number;
    if (enabled) {
      if (isPressingButton.value) {
        scale = withRepeat(
          withSpring(1, {
            stiffness: 100,
            damping: 1000,
          }),
          -1,
          true,
        );
      } else {
        scale = withSpring(0.9, {
          stiffness: 500,
          damping: 300,
        });
      }
    } else {
      scale = withSpring(0.6, {
        stiffness: 500,
        damping: 300,
      });
    }

    return {
      opacity: withTiming(enabled ? 1 : 0.3, {
        duration: 10,
        easing: Easing.linear,
      }),
      transform: [{ scale: scale }],
    };
  }, [enabled, isPressingButton]);

  const tapGesture = Gesture.Tap()
    .enabled(enabled)
    .shouldCancelWhenOutside(false)
    .maxDuration(99999999);
  tapGesture.handlers.onChange = onHandlerStateChanged;

  const panGesture = Gesture.Pan()
    .enabled(enabled)
    .failOffsetX([-viewport.width, viewport.width])
    .activeOffsetY([-2, 2]);
  panGesture.handlers.onChange = onPanGestureEvent;

  return (
    // <TapGestureHandler
    //   enabled={enabled}
    //   ref={tapHandler}
    //   onHandlerStateChange={onHandlerStateChanged}
    //   shouldCancelWhenOutside={false}
    //   maxDurationMs={99999999} // <-- this prevents the TapGestureHandler from going to State.FAILED when the user moves his finger outside of the child view (to zoom)
    //   simultaneousHandlers={panHandler}>
    //   <Reanimated.View {...props} style={[buttonStyle, style]}>
    //     <PanGestureHandler
    //       enabled={enabled}
    //       ref={panHandler}
    //       failOffsetX={panGestureHandlerFailX}
    //       activeOffsetY={panGestureHandlerActiveY}
    //       onGestureEvent={onPanGestureEvent}
    //       simultaneousHandlers={tapHandler}>
    //       <Reanimated.View style={s.flex}>
    //         <Reanimated.View style={[s.shadow, shadowStyle]} />
    //         <View style={s.buttonOuter}>
    //           <View style={s.buttonInner} />
    //         </View>
    //         <Text style={s.buttonInfo}>{'Press and hold for video'}</Text>
    //       </Reanimated.View>
    //     </PanGestureHandler>
    //   </Reanimated.View>
    // </TapGestureHandler>
    <GestureDetector gesture={Gesture.Race(tapGesture, panGesture)}>
      <Reanimated.View {...props} style={[buttonStyle, style]}>
        <Reanimated.View style={s.flex}>
          <Reanimated.View style={[s.shadow, shadowStyle]} />
          <View style={s.buttonOuter}>
            <View style={s.buttonInner} />
          </View>
          <Text style={s.buttonInfo}>{'Press and hold for video'}</Text>
        </Reanimated.View>
      </Reanimated.View>
    </GestureDetector>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  flex: {
    flex: 1,
    alignItems: 'center',
  },
  shadow: {
    position: 'absolute',
    top: 7,
    width: captureButtonSize - 14,
    height: captureButtonSize - 14,
    borderRadius: captureButtonSize / 2,
    backgroundColor: theme.colors.assertive,
    zIndex: 1,
  },
  buttonOuter: {
    width: captureButtonSize,
    height: captureButtonSize,
    borderRadius: captureButtonSize / 2,
    borderWidth: 3.5,
    borderColor: theme.colors.stickyWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInner: {
    width: captureButtonSize - 14,
    height: captureButtonSize - 14,
    borderRadius: captureButtonSize / 2,
    backgroundColor: theme.colors.stickyWhite,
  },
  buttonInfo: {
    ...theme.styles.textSmall,
    color: theme.colors.stickyWhite,
    top: 10,
  },
}));

export const CaptureButton = React.memo(_CaptureButton);
