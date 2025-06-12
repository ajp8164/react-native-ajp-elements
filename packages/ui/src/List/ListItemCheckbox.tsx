import { AppTheme, useTheme } from '../theme';
import { Avatar, CheckBox, Icon, ListItem } from '@rneui/base';
import {
  View,
  type ImageSourcePropType,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import React, { JSX } from 'react';
import { makeStyles } from '@rneui/themed';

interface ListItemCheckbox {
  bottomDividerColor?: string;
  bottomDividerLeft?: number;
  bottomDividerRight?: number;
  checked: boolean;
  checkedColor?: string;
  checkedIcon?: string | React.ReactElement<object>;
  checkedIconSize?: number;
  checkIconType?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  leftImage?: ImageSourcePropType | JSX.Element | string;
  leftImageColor?: string;
  leftImageSize?: number;
  leftImageType?: string;
  onPress: () => void;
  position?: ('first' | 'last' | undefined)[];
  subtitle?: string;
  subtitleNumberOfLines?: number;
  subtitleStyle?: TextStyle | TextStyle[];
  title?: string;
  titleNumberOfLines?: number;
  titleStyle?: TextStyle | TextStyle[];
  uncheckedIcon?: string | React.ReactElement<object>;
  uncheckedColor?: string;
  wrapperStyle?: ViewStyle | ViewStyle[];
}

const ListItemCheckbox = ({
  bottomDividerColor,
  bottomDividerLeft,
  bottomDividerRight,
  checked,
  checkedColor,
  checkedIcon,
  checkedIconSize,
  checkIconType,
  containerStyle = {},
  disabled,
  leftImage,
  leftImageColor,
  leftImageSize,
  leftImageType = 'ionicon',
  onPress,
  position,
  subtitle,
  subtitleNumberOfLines,
  subtitleStyle,
  title,
  titleNumberOfLines,
  titleStyle,
  uncheckedIcon,
  uncheckedColor,
  wrapperStyle,
}: ListItemCheckbox) => {
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
          <ListItem.Title
            style={[theme.styles.listItemTitle, titleStyle]}
            numberOfLines={titleNumberOfLines}>
            {title}
          </ListItem.Title>
          {subtitle && (
            <ListItem.Subtitle
              style={[theme.styles.listItemSubtitle, subtitleStyle]}
              numberOfLines={subtitleNumberOfLines}>
              {subtitle}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
        <ListItem.Content right style={s.rightImageContent}>
          <CheckBox
            containerStyle={{ padding: 0 }}
            checked={checked}
            disabled={disabled}
            checkedIcon={checkedIcon}
            size={checkedIconSize}
            iconType={checkIconType}
            checkedColor={checkedColor}
            uncheckedIcon={uncheckedIcon}
            uncheckedColor={uncheckedColor}
            wrapperStyle={wrapperStyle}
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
  rightImageContent: {
    maxWidth: 45,
  },
}));

export { ListItemCheckbox };
