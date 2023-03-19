import { AppTheme, useTheme } from '../theme';
import { Avatar, CheckBox, Icon, ListItem } from '@rneui/base';
import type { ImageSourcePropType, TextStyle, ViewStyle } from 'react-native';

import React from 'react';
import { makeStyles } from '@rneui/themed';

interface ListItemCheckbox {
  checked: boolean;
  checkedColor?: string;
  checkedIcon?: string | React.ReactElement;
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
  subtitleStyle?: TextStyle | TextStyle[];
  title?: string;
  titleStyle?: TextStyle | TextStyle[];
  uncheckedIcon?: string | React.ReactElement;
  uncheckedColor?: string;
}

const ListItemCheckbox = ({
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
  subtitleStyle,
  title,
  titleStyle,
  uncheckedIcon,
  uncheckedColor,
}: ListItemCheckbox) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <ListItem
      bottomDivider={!position?.includes('last')}
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
      <ListItem.Content right style={s.rightImageContent}>
        <CheckBox
          containerStyle={{
            borderWidth: 1,
            padding: 0,
          }}
          checked={checked}
          disabled={disabled}
          checkedIcon={checkedIcon}
          size={checkedIconSize}
          iconType={checkIconType}
          checkedColor={checkedColor}
          uncheckedIcon={uncheckedIcon}
          uncheckedColor={uncheckedColor}
        />
      </ListItem.Content>
    </ListItem>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
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
