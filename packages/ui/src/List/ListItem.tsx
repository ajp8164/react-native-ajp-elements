import { AppTheme, useTheme } from '../theme';
import { Avatar, Badge, Icon, ListItem as RNEListItem } from '@rneui/base';
import {
  ImageSourcePropType,
  Platform,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { AppleStyleSwipeableRow } from './AppleSwipeableRow';
import React from 'react';
import type { Swipeable } from 'react-native-gesture-handler';
import type { SwipeableItem } from '.';
import { makeStyles } from '@rneui/themed';

// 'imageType' specifies a valid RNE icon set
// See https://reactnativeelements.com/docs/components/icon#available-icon-sets

interface ListItem {
  alignContent?: 'middle' | 'top';
  badgeStatus?: 'primary' | 'success' | 'warning' | 'error';
  badgeValue?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  delayLongPress?: number;
  disabled?: boolean;
  disabledStyle?: ViewStyle | ViewStyle[];
  extraContentComponent?: JSX.Element;
  leftImage?: ImageSourcePropType | JSX.Element | string;
  leftImageColor?: string;
  leftImageSize?: number;
  leftImageType?: string;
  onLongPress?: () => void;
  onPress?: () => void;
  placeholder?: string;
  position?: ('first' | 'last' | undefined)[];
  rightImage?: ImageSourcePropType | JSX.Element | string | boolean;
  rightImageColor?: string;
  rightImageSize?: number;
  rightImageType?: string;
  subtitle?: string | JSX.Element;
  subtitleNumberOfLines?: number;
  subtitleStyle?: TextStyle | TextStyle[];
  swipeable?: React.RefObject<Swipeable>;
  swipeLeftItems?: SwipeableItem[];
  swipeRightItems?: SwipeableItem[];
  title?: string | JSX.Element;
  titleNumberOfLines?: number;
  titleStyle?: TextStyle | TextStyle[];
  value?: string | JSX.Element;
  valueStyle?: TextStyle | TextStyle[];
}

const ListItem = ({
  alignContent = 'middle',
  badgeStatus = 'primary',
  badgeValue,
  containerStyle,
  delayLongPress,
  disabled,
  disabledStyle = { opacity: 0.3 },
  extraContentComponent,
  leftImage,
  leftImageColor,
  leftImageSize,
  leftImageType = 'ionicon',
  onLongPress,
  onPress,
  placeholder = '\u00b7\u00b7\u00b7',
  position,
  rightImage = true,
  rightImageColor,
  rightImageSize,
  rightImageType = 'ionicon',
  subtitle,
  subtitleNumberOfLines,
  subtitleStyle,
  swipeable,
  swipeLeftItems,
  swipeRightItems,
  title,
  titleNumberOfLines,
  titleStyle,
  value,
  valueStyle,
}: ListItem) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <AppleStyleSwipeableRow
      ref={swipeable}
      leftItems={swipeLeftItems}
      rightItems={swipeRightItems}>
      <RNEListItem
        bottomDivider={!position?.includes('last')}
        containerStyle={[
          theme.styles.listItemContainer,
          !rightImage ? { paddingRight: 0 } : {},
          position?.includes('first') ? s.first : {},
          position?.includes('last') ? s.last : {},
          position?.includes('first' && 'last') ? s.swipeBorderFix : {},
          containerStyle,
        ]}
        disabled={disabled}
        disabledStyle={disabledStyle}
        delayLongPress={delayLongPress}
        onLongPress={onLongPress}
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
        <RNEListItem.Content
          style={[
            leftImage ? s.wLeftImage : {},
            alignContent === 'top' ? s.alignTop : {},
          ]}>
          <RNEListItem.Title
            style={[theme.styles.listItemTitle, titleStyle]}
            numberOfLines={titleNumberOfLines}>
            {title}
          </RNEListItem.Title>
          {subtitle !== undefined && (
            <RNEListItem.Subtitle
              style={[theme.styles.listItemSubtitle, subtitleStyle]}
              numberOfLines={subtitleNumberOfLines}>
              {subtitle}
            </RNEListItem.Subtitle>
          )}
        </RNEListItem.Content>
        {value !== undefined && (
          <RNEListItem.Content
            right
            style={[
              s.valueContent,
              rightImage ? s.wRightImage : {},
              alignContent === 'top' ? s.alignTopValue : {},
            ]}>
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
          <RNEListItem.Content
            right
            style={alignContent === 'top' ? s.alignTop : {}}>
            <Icon
              name={rightImage}
              type={rightImageType}
              color={rightImageColor || theme.colors.icon}
              size={rightImageSize}
            />
          </RNEListItem.Content>
        ) : rightImage ? (
          <RNEListItem.Chevron
            iconProps={theme.styles.listItemIconProps}
            containerStyle={alignContent === 'top' ? s.alignTop : {}}
          />
        ) : null}
      </RNEListItem>
    </AppleStyleSwipeableRow>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  alignTop: {
    alignSelf: 'flex-start',
  },
  alignTopValue: {
    top: 16, // Value position is absolute, need to offset down to account for padding
  },
  swipeBorderFix: {
    borderBottomWidth: 0.01, // Prevents swipable background color from appearing as bottom border while swipe in progress.
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
