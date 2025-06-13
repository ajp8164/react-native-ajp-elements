import { AppTheme, fontFamily, fontSizes, useTheme } from '../theme';
import { View, ViewStyle } from 'react-native';

import { Divider as RNEDivider } from '@rn-vui/base';
import React, { JSX } from 'react';
import { makeStyles } from '@rn-vui/themed';

interface Divider {
  color?: string;
  orientation?: 'vertical' | 'horizontal' | undefined;
  rightComponent?: JSX.Element | null;
  subHeaderStyle?: ViewStyle;
  style?: ViewStyle;
  text?: string;
  note?: boolean;
  width?: number;
}

const Divider = ({
  color,
  note,
  orientation,
  rightComponent = null,
  style,
  subHeaderStyle,
  text,
  width,
}: Divider) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <RNEDivider
      subHeader={text}
      subHeaderStyle={[s.subheader, note ? s.note : {}, subHeaderStyle]}
      color={color || s.color.color}
      orientation={orientation}
      style={[!text && { marginTop: 25 }, s.style, style]}
      width={width}
      children={<View style={s.children}>{rightComponent}</View>}
    />
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  style: {
    borderBottomWidth: 0,
  },
  color: {
    color: theme.colors.divider,
  },
  subheader: {
    marginTop: 25,
    marginBottom: 10,
    marginHorizontal: 10,
    color: theme.colors.textDim,
    fontSize: fontSizes.small,
    fontWeight: '500',
    fontFamily,
    zIndex: -1,
  },
  note: {
    ...theme.styles.textSmall,
    color: theme.colors.textDim,
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: 5,
  },
  children: {
    position: 'absolute',
    right: 0,
    marginTop: 20,
  },
}));

export { Divider };
