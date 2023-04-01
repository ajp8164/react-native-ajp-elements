import { AppTheme, useTheme } from './theme';
import { BlurView, BlurViewProps } from '@react-native-community/blur';

import { Platform } from 'react-native';
import React from 'react';
import { makeStyles } from '@rneui/themed';

const BlurBackground = React.memo(
  ({ style, ...props }: BlurViewProps): React.ReactElement | null => {
    const theme = useTheme();
    const s = useStyles(theme);

    if (Platform.OS !== 'ios') return null;

    return (
      <BlurView
        style={[s.background, style]}
        blurAmount={10}
        blurType={'dark'}
        reducedTransparencyFallbackColor={theme.colors.blackTransparentMid}
        {...props}
      />
    );
  },
);

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
}));

export { BlurBackground };
