import { AppTheme, useTheme } from '../theme';
import { Pressable, ViewProps } from 'react-native';
import React, { ReactNode } from 'react';

import { makeStyles } from '@rn-vui/themed';

interface ListEditorViewInterface extends ViewProps {
  children: ReactNode | ReactNode[];
  editorEnabledBySwipe: boolean;
  resetEditor: () => void;
}

const ListEditorView = ({
  children,
  editorEnabledBySwipe,
  resetEditor,
  ...rest
}: ListEditorViewInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <Pressable
      style={s.container}
      pointerEvents={editorEnabledBySwipe ? 'box-only' : 'auto'}
      onPress={resetEditor}
      {...rest}>
      <>{children}</>
    </Pressable>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
}));

export { ListEditorView };
