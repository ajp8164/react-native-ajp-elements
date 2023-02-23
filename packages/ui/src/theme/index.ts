import { Colors, Theme, useTheme as useRNETheme } from '@rneui/themed';

import type { Styles } from './types/Styles';
import { useStyles } from './styles';

export type { ColorSet } from './types/Colors';
export type { Styles } from './types/Styles';

export * from './avatars';
export * from './svg';
export {
  fontSizes,
  fontFamily,
  fontFamilyBold,
  fontFamilyLight,
  viewport,
} from './styles';

export { theme } from './theme';
export { useStyles } from './styles';

export const useTheme = () => {
  const { theme } = useRNETheme();
  const styles = useStyles();
  return {
    ...theme,
    styles,
  };
};

export interface AppTheme extends Theme {
  colors: Colors;
  styles: Styles;
}
