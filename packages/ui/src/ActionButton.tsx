import { AppTheme, useTheme } from './theme';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import { Avatar } from '@rneui/base';
import React from 'react';
import { makeStyles } from '@rneui/themed';

interface ActionButton {
  buttonStyle?: ViewStyle;
  iconName?: string;
  iconSize?: number;
  iconStyle?: ViewStyle | ViewStyle[];
  iconType?: string;
  ImageComponent?: React.ComponentClass;
  onPress: () => void;
  title?: string;
  titleStyle?: TextStyle | TextStyle[];
}

const ActionButton = ({
  buttonStyle,
  iconName,
  iconSize = 30,
  iconStyle,
  iconType = 'ionicon',
  ImageComponent,
  onPress,
  title,
  titleStyle,
}: ActionButton) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <TouchableOpacity style={s.actionButton} onPress={onPress}>
      <Avatar
        size={60}
        rounded
        icon={{
          name: iconName,
          type: iconType,
          size: iconSize,
          color: theme.colors.brandPrimary,
        }}
        containerStyle={{ ...s.actionButtonBackground, ...buttonStyle }}
        iconStyle={iconStyle}
        ImageComponent={ImageComponent}
      />
      <Text style={[s.actionButtonTitle, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  actionButton: {
    width: 70,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  actionButtonBackground: {
    backgroundColor: theme.colors.hintGray,
  },
  actionButtonTitle: {
    ...theme.styles.textSmall,
    ...theme.styles.textBold,
    marginTop: 5,
    textAlign: 'center',
  },
}));

export { ActionButton };
