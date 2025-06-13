import { AppTheme, useTheme } from '../theme';
import { Avatar, Badge, Icon, ListItem } from '@rn-vui/base';
import {
  ImageSourcePropType,
  LayoutAnimation,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, { JSX, ReactNode, useRef } from 'react';

import Drawer from 'react-native-ui-lib/drawer';
import type { DrawerItemProps } from 'react-native-ui-lib';
import { makeStyles } from '@rn-vui/themed';
import type { IconProps } from'react-native-vector-icons/Icon';

// 'imageType' specifies a valid RNE icon set
// See https://reactnativeelements.com/docs/components/icon#available-icon-sets

interface ListItemSwipable {
  badgeStatus?: 'primary' | 'success' | 'warning' | 'error';
  badgeValue?: string;
  bottomDividerColor?: string;
  bottomDividerLeft?: number;
  bottomDividerRight?: number;
  containerStyle?: ViewStyle | ViewStyle[];
  fullSwipeLeftDestructive?: boolean;
  fullSwipeRightDestructive?: boolean;
  leftImage?: ImageSourcePropType | JSX.Element | string;
  leftImageColor?: string;
  leftImageType?: string;
  leftImageSize?: number;
  leftItem?: DrawerItemProps;
  onPress?: () => void;
  position?: ('first' | 'last' | undefined)[];
  rightImage?: ImageSourcePropType | JSX.Element | string | boolean;
  rightImageColor?: string;
  rightImageSize?: number;
  rightImageType?: string;
  rightItems?: DrawerItemProps[];
  subtitle?: string | ReactNode;
  subtitleStyle?: TextStyle | TextStyle[];
  title?: string | ReactNode;
  titleStyle?: TextStyle | TextStyle[];
  value?: string | JSX.Element;
  valueStyle?: TextStyle | TextStyle[];
}

const ListItemSwipable = ({
  badgeStatus = 'primary',
  badgeValue,
  bottomDividerColor,
  bottomDividerLeft,
  bottomDividerRight,
  containerStyle = {},
  fullSwipeLeftDestructive,
  fullSwipeRightDestructive,
  leftImage,
  leftImageColor,
  leftImageSize,
  leftImageType = 'ionicon',
  leftItem,
  onPress,
  position,
  rightImage = true,
  rightImageColor,
  rightImageSize,
  rightImageType = 'ionicon',
  rightItems,
  subtitle,
  subtitleStyle,
  title,
  titleStyle,
  value,
  valueStyle,
}: ListItemSwipable) => {
  const theme = useTheme();
  const s = useStyles(theme);

  bottomDividerColor =
    bottomDividerColor || (theme.styles.listItemBorder.borderColor as string);
  bottomDividerLeft =
    bottomDividerLeft || (theme.styles.listItemBorder.left as number);
  bottomDividerRight =
    bottomDividerRight || (theme.styles.listItemBorder.right as number);

  const drawerRef = useRef(null);

  const closeDrawer = () => {
    if (drawerRef) {
      // @ts-ignore
      drawerRef.current?.closeDrawer();
    }
  };

  const animateRemoveItem = (callback: () => void) => {
    setTimeout(() => {
      LayoutAnimation.configureNext({
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.scaleY,
        },
        delete: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.scaleY,
          duration: 120,
        },
        duration: 60,
      });
      callback();
    }, 200);
  };

  return (
    <Drawer
      ref={drawerRef}
      rightItems={rightItems}
      leftItem={leftItem}
      fullSwipeLeft
      fullSwipeRight
      onFullSwipeLeft={() => {
        const onPress = leftItem?.onPress || (() => undefined);
        if (fullSwipeLeftDestructive) {
          animateRemoveItem(() => {
            onPress();
          });
        } else {
          closeDrawer();
          onPress();
        }
      }}
      onFullSwipeRight={() => {
        const onPress =
          (rightItems && rightItems[0])?.onPress || (() => undefined);
        if (fullSwipeRightDestructive) {
          animateRemoveItem(() => {
            onPress();
          });
        } else {
          closeDrawer();
          onPress();
        }
      }}>
      {!position?.includes('last') ? (
        <View
          style={[
            s.bottomDivider,
            {
              borderColor: bottomDividerColor,
              left: bottomDividerLeft,
              right: bottomDividerRight,
            },
          ]}
        />
      ) : null}
      <ListItem
        containerStyle={[
          theme.styles.listItemContainer,
          position?.includes('first') ? s.first : {},
          position?.includes('last') ? s.last : {},
          containerStyle,
        ]}
        onPress={onPress}>
        {React.isValidElement(leftImage) ? (
          <ListItem.Content style={s.leftImageContent}>
            {leftImage}
          </ListItem.Content>
        ) : typeof leftImage === 'string' ? (
          <Icon
            name={leftImage}
            type={leftImageType}
            color={leftImageColor || theme.colors.icon}
            size={leftImageSize}
          />
        ) : leftImage !== undefined ? (
          <Avatar
            source={leftImage as ImageSourcePropType}
            imageProps={{ resizeMode: 'contain' }}
          />
        ) : null}
        <ListItem.Content>
          <ListItem.Title style={[theme.styles.listItemTitle, titleStyle]}>
            {title}
          </ListItem.Title>
          {subtitle !== undefined && (
            <ListItem.Subtitle
              style={[theme.styles.listItemSubtitle, subtitleStyle]}>
              {subtitle}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
        {value !== undefined && (
          <ListItem.Content right style={s.valueContent}>
            <ListItem.Subtitle style={[theme.styles.listItemValue, valueStyle]}>
              {value}
            </ListItem.Subtitle>
          </ListItem.Content>
        )}
        {badgeValue !== undefined && (
          <Badge
            value={badgeValue}
            containerStyle={s.badgeContainer}
            textStyle={s.badgeText}
            badgeStyle={[
              s.badge,
              { backgroundColor: theme.colors?.[badgeStatus] },
            ]}
          />
        )}
        {React.isValidElement(rightImage) ? (
          <ListItem.Content right style={s.rightImageContent}>
            {rightImage}
          </ListItem.Content>
        ) : typeof rightImage === 'string' ? (
          <ListItem.Content right>
            <Icon
              name={rightImage}
              type={rightImageType}
              color={rightImageColor || theme.colors.icon}
              size={rightImageSize}
            />
          </ListItem.Content>
        ) : rightImage ? (
          <ListItem.Chevron iconProps={theme.styles.listItemIconProps as IconProps} />
        ) : null}
      </ListItem>
    </Drawer>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  bottomDivider: {
    borderWidth: StyleSheet.hairlineWidth,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  first: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  last: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  badgeContainer: {
    right: -8,
  },
  badgeText: {
    ...theme.styles.textTiny,
    ...theme.styles.textBold,
    color: theme.colors.stickyWhite,
  },
  badge: {
    borderWidth: 0,
  },
  leftImageContent: {
    maxWidth: 25,
  },
  rightImageContent: {
    maxWidth: 25,
  },
  valueContent: {
    right: -10,
  },
}));

export { ListItemSwipable };
