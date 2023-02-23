/**
 * See https://github.com/funcsio/react-native-swipe-button-tutorial
 */

import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AppTheme, useTheme } from './theme';
import type { ColorValue, TextStyle, ViewStyle } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import React, { ReactNode } from 'react';

import LinearGradient from 'react-native-linear-gradient';
import { makeStyles } from '@rneui/themed';
import { useState } from 'react';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type AnimatedGHContext = {
  completed: boolean;
};

type Extra = {
  height: number;
  padding: number;
  textColor: ColorValue;
  trackColor: ColorValue;
  width: number;
  swipableDimensions: number;
};

interface SwipeButtonInterface {
  containerStyle?: ViewStyle | ViewStyle[];
  onToggle: (value: boolean) => void;
  height?: number;
  padding?: number;
  text?: string;
  textStyle?: TextStyle | TextStyle[];
  textColor?: ColorValue;
  thumbComponent?: ReactNode;
  thumbStartColor?: ColorValue;
  thumbStyle?: ViewStyle | ViewStyle[];
  thumbEndColor?: ColorValue;
  trackColor?: ColorValue;
  trackStartColor?: ColorValue;
  trackEndColor?: ColorValue;
  width?: number;
}

const SwipeButton = ({
  containerStyle,
  onToggle,
  height = 40,
  padding = 5,
  text,
  textColor,
  textStyle,
  thumbComponent = null,
  thumbStartColor,
  thumbStyle,
  thumbEndColor,
  trackColor,
  trackStartColor,
  trackEndColor,
  width = 180,
}: SwipeButtonInterface) => {
  const swipableDimensions = height - 2 * padding;
  const hWaveRange = swipableDimensions + 2 * padding;
  const hSwipeRange = width - 2 * padding - swipableDimensions;

  const theme = useTheme();

  textColor = textColor || theme.styles.buttonTitle.color || '#ffffff';
  thumbStartColor =
    thumbStartColor || theme.styles.buttonTitle.color || '#ffffff';
  thumbEndColor = thumbEndColor || theme.styles.buttonTitle.color || '#ffffff';
  trackColor = trackColor || theme.styles.button.backgroundColor || '#c0c0c0';
  trackStartColor =
    trackStartColor || theme.styles.button.backgroundColor || '#c0c0c0';
  trackEndColor =
    trackEndColor || theme.styles.button.backgroundColor || '#c0c0c0';

  const extra: Extra = {
    height,
    padding,
    textColor,
    trackColor,
    width,
    swipableDimensions,
  };
  theme.styles.extra = extra;
  const s = useStyles(theme);

  // Animated value for X translation
  const X = useSharedValue(0);
  // Toggled State
  const [toggled, setToggled] = useState(false);

  // Fires when animation ends
  const handleComplete = (isToggled: boolean) => {
    if (isToggled !== toggled) {
      setToggled(isToggled);
      onToggle(isToggled);
    }
  };

  // Gesture Handler Events
  const animatedGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >({
    onStart: (_, ctx) => {
      'worklet';
      ctx.completed = toggled;
    },
    onActive: (e, ctx) => {
      'worklet';
      let newValue;
      if (ctx.completed) {
        newValue = hSwipeRange + e.translationX;
      } else {
        newValue = e.translationX;
      }

      if (newValue >= 0 && newValue <= hSwipeRange) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      'worklet';
      if (X.value < width / 2 - swipableDimensions / 2) {
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      } else {
        X.value = withSpring(hSwipeRange);
        runOnJS(handleComplete)(true);
      }
    },
  });

  const InterpolateXInput = [0, hSwipeRange];
  const AnimatedStyles = {
    swipeContainer: useAnimatedStyle(() => {
      'worklet';
      return {};
    }),
    colorWave: useAnimatedStyle(() => {
      'worklet';
      return {
        width: hWaveRange + X.value,
        opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
      };
    }),
    swipeable: useAnimatedStyle(() => {
      'worklet';
      return {
        backgroundColor: interpolateColor(
          X.value,
          [0, width - swipableDimensions - padding],
          [thumbStartColor as string, thumbEndColor as string],
        ),
        transform: [{ translateX: X.value }],
      };
    }),
    swipeText: useAnimatedStyle(() => {
      'worklet';
      return {
        opacity: interpolate(
          X.value,
          InterpolateXInput,
          [1, 0],
          Extrapolate.CLAMP,
        ),
        transform: [
          {
            translateX: interpolate(
              X.value,
              InterpolateXInput,
              [0, width / 2 - swipableDimensions],
              Extrapolate.CLAMP,
            ),
          },
        ],
      };
    }),
  };

  return (
    <Animated.View
      style={[s.swipeContainer, AnimatedStyles.swipeContainer, containerStyle]}>
      <AnimatedLinearGradient
        style={[AnimatedStyles.colorWave, s.colorWave]}
        colors={[trackStartColor as string, trackEndColor as string]}
        start={{ x: 0.0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
      <PanGestureHandler onGestureEvent={animatedGestureHandler}>
        <Animated.View
          style={[s.swipeable, AnimatedStyles.swipeable, thumbStyle]}>
          {thumbComponent}
        </Animated.View>
      </PanGestureHandler>
      <Animated.Text style={[s.swipeText, AnimatedStyles.swipeText, textStyle]}>
        {text}
      </Animated.Text>
    </Animated.View>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  swipeContainer: {
    height: theme.styles.extra.height,
    width: theme.styles.extra.width,
    backgroundColor: theme.styles.extra.trackColor,
    borderRadius: theme.styles.extra.height,
    padding: theme.styles.extra.padding,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  colorWave: {
    position: 'absolute',
    left: 0,
    height: theme.styles.extra.height,
    borderRadius: theme.styles.extra.height,
  },
  swipeable: {
    position: 'absolute',
    left: theme.styles.extra.padding,
    height: theme.styles.extra.swipableDimensions,
    width: theme.styles.extra.swipableDimensions,
    borderRadius: theme.styles.extra.swipableDimensions,
    zIndex: 3,
  },
  swipeText: {
    ...theme.styles.textNormal,
    alignSelf: 'center',
    zIndex: 2,
    color: theme.styles.extra.textColor,
  },
}));

export { SwipeButton };
