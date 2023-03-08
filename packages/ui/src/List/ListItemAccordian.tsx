import { AppTheme, useTheme } from '../theme';
import { Avatar, Badge, Icon, ListItem } from '@rneui/base';
import type { ImageSourcePropType, TextStyle, ViewStyle } from 'react-native';
import React, { ReactNode, useState } from 'react';

import { makeStyles } from '@rneui/themed';

// 'imageType' specifies a valid RNE icon set
// See https://reactnativeelements.com/docs/components/icon#available-icon-sets

interface ListItemAccordian {
  badgeStatus?: 'primary' | 'success' | 'warning' | 'error';
  badgeValue?: string;
  children: ReactNode;
  containerStyle?: ViewStyle | ViewStyle[];
  initiallyExpanded?: boolean;
  leftImage?: ImageSourcePropType | JSX.Element | string;
  leftImageColor?: string;
  leftImageSize?: number;
  leftImageType?: string;
  position?: ('first' | 'last' | undefined)[];
  rightImage?: ImageSourcePropType | JSX.Element | string | boolean;
  rightImageColor?: string;
  rightImageSize?: number;
  rightImageType?: string;
  subtitle?: string;
  subtitleRight?: boolean;
  subtitleStyle?: TextStyle | TextStyle[];
  title?: string | ReactNode;
  titleStyle?: TextStyle | TextStyle[];
}

const ListItemAccordian = ({
  badgeStatus = 'primary',
  badgeValue,
  children,
  containerStyle,
  initiallyExpanded,
  leftImage,
  leftImageColor,
  leftImageSize,
  leftImageType = 'ionicon',
  position,
  rightImage = 'chevron-down',
  rightImageColor,
  rightImageSize = 22,
  rightImageType = 'ionicon',
  subtitle,
  subtitleRight,
  subtitleStyle,
  title,
  titleStyle,
}: ListItemAccordian) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const [expanded, setExpanded] = useState(initiallyExpanded);

  return (
    <ListItem.Accordion
      bottomDivider={!position?.includes('last') || expanded}
      containerStyle={[
        theme.styles.listItemContainer,
        position?.includes('first') ? s.first : {},
        position?.includes('last') && !expanded ? s.last : {},
        containerStyle,
      ]}
      noIcon={rightImage === false}
      icon={
        typeof rightImage === 'string' && (
          <Icon
            name={rightImage}
            type={rightImageType}
            color={rightImageColor || theme.colors.icon}
            size={rightImageSize}
          />
        )
      }
      content={
        <>
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
          <ListItem.Content style={[leftImage ? s.wLeftImage : {}]}>
            <ListItem.Title style={[theme.styles.listItemTitle, titleStyle]}>
              {title}
            </ListItem.Title>
            {subtitleRight === true && (
              <ListItem.Subtitle
                style={[theme.styles.listItemSubtitle, subtitleStyle]}>
                {subtitle}
              </ListItem.Subtitle>
            )}
          </ListItem.Content>
          {subtitleRight && (
            <ListItem.Content right>
              <ListItem.Subtitle
                style={[theme.styles.listItemSubtitle, subtitleStyle]}>
                {subtitle}
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
        </>
      }
      isExpanded={expanded}
      onPress={() => {
        setExpanded(!expanded);
      }}>
      {children}
    </ListItem.Accordion>
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
  },
  badge: {
    borderWidth: 0,
  },
  leftImageContent: {
    maxWidth: 25,
  },
  wLeftImage: {
    left: 8,
  },
}));

export { ListItemAccordian };
