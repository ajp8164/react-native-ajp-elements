import { AppTheme, useTheme } from '../theme';
import React, { ReactNode } from 'react';

import { Pressable } from 'react-native';
import { makeStyles } from '@rneui/themed';

interface ListEditorViewInterface {
  children: ReactNode | ReactNode[];
  editorEnabledBySwipe: boolean;
  resetEditor: () => void;
}

const ListEditorView = ({
  children,
  editorEnabledBySwipe,
  resetEditor,
}: ListEditorViewInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <Pressable
      style={s.container}
      pointerEvents={editorEnabledBySwipe ? 'box-only' : 'auto'}
      onPress={resetEditor}>
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
