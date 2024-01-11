import { Animated, I18nManager, Text, View } from 'react-native';
import { AppTheme, useTheme } from '../theme';
import React, { ReactNode, useRef } from 'react';

import { Icon } from '@rneui/base';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import type { SwipeableItem } from './index';
import { makeStyles } from '@rneui/themed';

interface AppleStyleSwipeableRow {
  children: ReactNode | ReactNode[];
  leftItems?: SwipeableItem[];
  rightItems?: SwipeableItem[];
}

const AppleStyleSwipeableRow = ({
  children,
  leftItems,
  rightItems,
}: AppleStyleSwipeableRow) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const swipeableRef = useRef<Swipeable>(null);

  const renderLeftAction = (
    item: SwipeableItem,
    progress: Animated.AnimatedInterpolation<number>,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={item.text}
        style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[s.leftAction, { backgroundColor: item.color }]}
          onPress={() => {
            close();
            item.onPress && item.onPress();
          }}>
          {item.icon && (
            <Icon
              name={item.icon}
              type={item.iconType}
              color={theme.colors.stickyWhite}
              size={22}
            />
          )}
          <Text style={s.actionText}>{item.text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>,
  ) => {
    if (!leftItems) return null;
    return (
      <View
        style={{
          width: leftItems[0].x,
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}>
        {leftItems.map(item => {
          return renderLeftAction(item, progress);
        })}
      </View>
    );
  };

  const renderRightAction = (
    item: SwipeableItem,
    progress: Animated.AnimatedInterpolation<number>,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [item.x, 0],
    });

    return (
      <Animated.View
        key={item.text}
        style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[s.rightAction, { backgroundColor: item.color }]}
          onPress={() => {
            close();
            item.onPress && item.onPress();
          }}>
          {item.icon && (
            <Icon
              name={item.icon}
              type={item.iconType}
              color={theme.colors.stickyWhite}
              size={22}
            />
          )}
          <Text style={s.actionText}>{item.text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>,
  ) => {
    if (!rightItems) return null;
    return (
      <View
        style={{
          width: rightItems[0].x,
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}>
        {rightItems.map(item => {
          return renderRightAction(item, progress);
        })}
      </View>
    );
  };

  const close = () => {
    swipeableRef.current?.close();
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}>
      {children}
    </Swipeable>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  leftAction: {
    flex: 1,
    justifyContent: 'center',
  },
  actionText: {
    ...theme.styles.textTiny,
    color: theme.colors.stickyWhite,
    backgroundColor: theme.colors.transparent,
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export { AppleStyleSwipeableRow };
