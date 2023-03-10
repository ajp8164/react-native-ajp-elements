import { AppTheme, useTheme } from '../theme';
import { Avatar, Badge, Icon, ListItem as RNEListItem } from '@rneui/base';
import {
  ImageSourcePropType,
  Platform,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import React from 'react';
import { makeStyles } from '@rneui/themed';

// 'imageType' specifies a valid RNE icon set
// See https://reactnativeelements.com/docs/components/icon#available-icon-sets

interface ListItem {
  badgeStatus?: 'primary' | 'success' | 'warning' | 'error';
  badgeValue?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  disabledStyle?: ViewStyle | ViewStyle[];
  extraContentComponent?: JSX.Element;
  leftImage?: ImageSourcePropType | JSX.Element | string;
  leftImageColor?: string;
  leftImageSize?: number;
  leftImageType?: string;
  onPress?: () => void;
  placeholder?: string;
  position?: ('first' | 'last' | undefined)[];
  rightImage?: ImageSourcePropType | JSX.Element | string | boolean;
  rightImageColor?: string;
  rightImageSize?: number;
  rightImageType?: string;
  subtitle?: string | JSX.Element;
  subtitleStyle?: TextStyle | TextStyle[];
  title?: string | JSX.Element;
  titleStyle?: TextStyle | TextStyle[];
  value?: string | JSX.Element;
  valueStyle?: TextStyle | TextStyle[];
}

const ListItem = ({
  badgeStatus = 'primary',
  badgeValue,
  containerStyle,
  disabled,
  disabledStyle = { opacity: 0.3 },
  extraContentComponent,
  leftImage,
  leftImageColor,
  leftImageSize,
  leftImageType = 'ionicon',
  onPress,
  placeholder = '\u00b7\u00b7\u00b7',
  position,
  rightImage = true,
  rightImageColor,
  rightImageSize,
  rightImageType = 'ionicon',
  subtitle,
  subtitleStyle,
  title,
  titleStyle,
  value,
  valueStyle,
}: ListItem) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <RNEListItem
      bottomDivider={!position?.includes('last')}
      containerStyle={[
        theme.styles.listItemContainer,
        !rightImage ? { paddingRight: 0 } : {},
        position?.includes('first') ? s.first : {},
        position?.includes('last') ? s.last : {},
        containerStyle,
      ]}
      disabled={disabled}
      disabledStyle={disabledStyle}
      onPress={onPress}>
      {extraContentComponent}
      {React.isValidElement(leftImage) ? (
        <RNEListItem.Content style={s.leftImageContent}>
          {leftImage}
        </RNEListItem.Content>
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
      <RNEListItem.Content style={[leftImage ? s.wLeftImage : {}]}>
        <RNEListItem.Title style={[theme.styles.listItemTitle, titleStyle]}>
          {title}
        </RNEListItem.Title>
        {subtitle !== undefined && (
          <RNEListItem.Subtitle
            style={[theme.styles.listItemSubtitle, subtitleStyle]}>
            {subtitle}
          </RNEListItem.Subtitle>
        )}
      </RNEListItem.Content>
      {value !== undefined && (
        <RNEListItem.Content
          right
          style={[s.valueContent, rightImage ? s.wRightImage : {}]}>
          {React.isValidElement(value) ? (
            value
          ) : (
            <Text style={[theme.styles.listItemValue, valueStyle]}>
              {value || placeholder}
            </Text>
          )}
        </RNEListItem.Content>
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
        <RNEListItem.Content right style={s.rightImageContent}>
          {rightImage}
        </RNEListItem.Content>
      ) : typeof rightImage === 'string' ? (
        <RNEListItem.Content right>
          <Icon
            name={rightImage}
            type={rightImageType}
            color={rightImageColor || theme.colors.icon}
            size={rightImageSize}
          />
        </RNEListItem.Content>
      ) : rightImage ? (
        <RNEListItem.Chevron iconProps={theme.styles.listItemIconProps} />
      ) : null}
    </RNEListItem>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
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
    ...Platform.select({
      android: {
        top: -1,
      },
    }),
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
    position: 'absolute',
    right: 15,
  },
  wLeftImage: {
    left: -8,
  },
  wRightImage: {
    right: 40,
  },
}));

export { ListItem };
