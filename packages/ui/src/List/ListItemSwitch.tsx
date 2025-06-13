import { AppTheme, useTheme } from '../theme';
import { Avatar, Icon, ListItem, Switch } from '@rn-vui/base';
import {
  View,
  type ImageSourcePropType,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import React, { JSX } from 'react';
import { makeStyles } from '@rn-vui/themed';

interface ListItemSwitch {
  bottomDividerColor?: string;
  bottomDividerLeft?: number;
  bottomDividerRight?: number;
  containerStyle?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  leftImage?: ImageSourcePropType | JSX.Element | string;
  leftImageColor?: string;
  leftImageSize?: number;
  leftImageType?: string;
  onValueChange: (value: boolean) => void;
  position?: ('first' | 'last' | undefined)[];
  subtitle?: string;
  subtitleStyle?: TextStyle | TextStyle[];
  switchStyle?: ViewStyle | ViewStyle[];
  title?: string;
  titleStyle?: TextStyle | TextStyle[];
  value: boolean;
}

const ListItemSwitch = ({
  bottomDividerColor,
  bottomDividerLeft,
  bottomDividerRight,
  containerStyle = {},
  disabled,
  leftImage,
  leftImageColor,
  leftImageSize,
  leftImageType = 'ionicon',
  onValueChange,
  position,
  subtitle,
  subtitleStyle,
  switchStyle = {},
  title,
  titleStyle,
  value,
}: ListItemSwitch) => {
  const theme = useTheme();
  const s = useStyles(theme);

  bottomDividerColor =
    bottomDividerColor || (theme.styles.listItemBorder.borderColor as string);
  bottomDividerLeft =
    bottomDividerLeft || (theme.styles.listItemBorder.left as number);
  bottomDividerRight =
    bottomDividerRight || (theme.styles.listItemBorder.right as number);

  return (
    <View>
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
          { paddingVertical: 8.5 },
          position?.includes('first') ? s.first : {},
          position?.includes('last') ? s.last : {},
          containerStyle,
        ]}>
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
          {subtitle && (
            <ListItem.Subtitle
              style={[theme.styles.listItemSubtitle, subtitleStyle]}>
              {subtitle}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
        <ListItem.Content right>
          <Switch
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
            thumbColor={
              value ? theme.colors.switchOnThumb : theme.colors.switchOffThumb
            }
            trackColor={{
              true: theme.colors.switchOnTrack,
              false: theme.colors.switchOffTrack,
            }}
            style={switchStyle}
          />
        </ListItem.Content>
      </ListItem>
    </View>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
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
  leftImageContent: {
    maxWidth: 25,
  },
}));

export { ListItemSwitch };
