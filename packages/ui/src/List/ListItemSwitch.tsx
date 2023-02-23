import { AppTheme, useTheme } from '../theme';
import { Avatar, Icon, ListItem, Switch } from '@rneui/base';
import type { ImageSourcePropType, TextStyle, ViewStyle } from 'react-native';

import React from 'react';
import { makeStyles } from '@rneui/themed';

interface ListItemSwitch {
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

  return (
    <ListItem
      bottomDivider={!position?.includes('last')}
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
}));

export { ListItemSwitch };
