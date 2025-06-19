import React, { type ReactNode, useEffect } from 'react';

import { useColorScheme } from 'react-native';
import { useTheme } from '@rn-vui/themed';

interface Props {
  children: ReactNode;
  themeSettings: { followDevice: boolean; app: string };
}

// Handles device level changes filtered by app settings.
const ColorModeSwitch = ({ children, themeSettings }: Props) => {
  const { updateTheme } = useTheme();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const control = themeSettings.followDevice
      ? colorScheme
      : themeSettings.app;

    updateTheme({
      mode: control === 'dark' ? 'dark' : 'light',
    });
  }, [colorScheme, updateTheme]);

  return <>{children}</>;
};

export { ColorModeSwitch };
