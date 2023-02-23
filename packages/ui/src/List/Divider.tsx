import { AppTheme, fontFamily, fontSizes, useTheme } from '../theme';

import { Divider as RNEDivider } from '@rneui/base';
import React from 'react';
import type { ViewStyle } from 'react-native';
import { makeStyles } from '@rneui/themed';

interface Divider {
  color?: string;
  orientation?: 'vertical' | 'horizontal' | undefined;
  subHeaderStyle?: ViewStyle;
  style?: ViewStyle;
  text?: string;
  type?: 'default' | 'note';
  width?: number;
}

const Divider = ({
  color,
  orientation,
  style,
  subHeaderStyle,
  text,
  type = 'default',
  width,
}: Divider) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <RNEDivider
      subHeader={text}
      subHeaderStyle={[
        s.subheader,
        type === 'note' ? s.note : {},
        subHeaderStyle,
      ]}
      color={color || s.color.color}
      orientation={orientation}
      style={[!text && { marginTop: 25 }, s.style, style]}
      width={width}
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
  },
  note: {
    ...theme.styles.textSmall,
    color: theme.colors.textDim,
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: 5,
  },
}));

export { Divider };
