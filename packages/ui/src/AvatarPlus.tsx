import { type AppTheme, getColoredSvg, useTheme } from './theme';
import { Badge, Icon, Image } from '@rn-vui/base';
import {
  type ImageSourcePropType,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import type { Avatar } from '@react-native-ajp-elements/common';
import { Gravatar } from 'react-native-gravatar';
import React from 'react';
import { SvgXml } from 'react-native-svg';
import { makeStyles } from '@rn-vui/themed';

interface AvatarPlus {
  iconName?: string;
  iconType?: string;
  svgName?: string;
  avatar?: Avatar;
  badgeCount?: number;
  color?: string;
  gravatarEmail?: string;
  textStyle?: TextStyle | TextStyle[];
  iconStyle?: ViewStyle | ViewStyle[];
  iconContainerStyle?: ViewStyle | ViewStyle[];
}

const AvatarPlus = ({
  iconName,
  iconType = 'ionicon',
  svgName,
  avatar,
  gravatarEmail,
  badgeCount = 0,
  color,
  iconStyle,
  iconContainerStyle,
}: AvatarPlus) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <View>
      {avatar?.collection === 'Gravatars' ? (
        <View>
          <Gravatar
            options={{
              email: gravatarEmail,
              parameters: {
                size: '200',
                d: avatar.image === 'gravatar' ? undefined : avatar.image,
                r: 'pg',
              },
              secure: true,
            }}
            style={[s.gravatar, iconContainerStyle]}
          />
        </View>
      ) : avatar ? (
        <View
          style={[
            s.avatarContainer,
            iconContainerStyle,
            { borderColor: color },
          ]}>
          <Image
            style={[s.avatar, avatar.style, iconStyle]}
            source={avatar.image as ImageSourcePropType}
          />
        </View>
      ) : svgName ? (
        <SvgXml
          width={30}
          height={30}
          color={color}
          style={[{ position: 'relative', top: 3 }, iconStyle]}
          xml={svgName && getColoredSvg(svgName)}
        />
      ) : iconName ? (
        <Icon name={iconName} type={iconType} color={color} size={30} />
      ) : null}
      {badgeCount > 0 && (
        <Badge
          value={badgeCount}
          containerStyle={s.badgeContainer}
          textStyle={s.badgeText}
          badgeStyle={s.badge}
        />
      )}
    </View>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  badgeContainer: {
    position: 'absolute',
    right: -13,
    top: -12,
  },
  badge: {
    backgroundColor: theme.colors.error,
    borderWidth: 0,
    borderRadius: 25,
    width: 23,
    height: 23,
  },
  badgeText: {
    ...theme.styles.textNormal,
    color: theme.colors.stickyWhite,
  },
  avatarContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.subtleGray,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 0,
  },
  avatar: {
    width: 28,
    height: 28,
  },
  gravatar: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: theme.colors.subtleGray,
    borderRadius: 37,
    alignSelf: 'center',
  },
}));

export { AvatarPlus };
