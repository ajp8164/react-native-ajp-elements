import { type AppTheme, useTheme } from '../../theme';
import type { ModalMethods, ModalProps } from './types';
import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import { BottomSheet } from '../../BottomSheet';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { makeStyles } from '@rn-vui/themed';

type Modal = ModalMethods;

const Modal = React.forwardRef<Modal, ModalProps>((props, ref) => {
  const {
    backdrop = true,
    backgroundStyle,
    children,
    background = 'normal',
    enableGestureBehavior = true,
    handleComponent,
    handleIndicatorStyle,
    modalParent = false,
    scrollEnabled = true,
    snapPoints = useMemo(() => ['92%'], []),
    onClose = useCallback(() => {
      return;
    }, []),
    onDismiss = useCallback(() => {
      return;
    }, []),
  } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const innerRef = useRef<BottomSheetModalMethods>(null);

  const enablePanDownToClose = enableGestureBehavior;
  const enableHandlePanningGesture = enableGestureBehavior;
  const touchBackdropBehavior = enableGestureBehavior ? 'close' : 'none';

  const backgroundColor = useMemo(() => {
    return background === 'normal'
      ? theme.colors.viewAltBackground
      : theme.colors.viewInvBackground;
  }, []);

  const handleIndicator = useMemo(() => {
    return background === 'normal'
      ? theme.colors.black
      : theme.colors.stickyWhite;
  }, []);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    close,
    collapse,
    dismiss,
    expand,
    forceClose,
    present,
    snapToIndex,
    snapToPosition,
  }));

  const close = () => {
    innerRef.current?.close();
  };

  const collapse = () => {
    innerRef.current?.collapse();
  };

  const dismiss = () => {
    innerRef.current?.dismiss();
  };

  const expand = () => {
    innerRef.current?.expand();
  };

  const forceClose = () => {
    innerRef.current?.close();
  };

  const present = () => {
    innerRef.current?.present();
  };

  const snapToIndex = (index: number) => {
    innerRef.current?.snapToIndex(index);
  };

  const snapToPosition = (position: string | number) => {
    innerRef.current?.snapToPosition(position);
  };

  return (
    <BottomSheet
      innerRef={innerRef}
      modalParent={modalParent}
      snapPoints={snapPoints}
      activeOffsetX={[-50, 50]} // See https://github.com/gorhom/react-native-bottom-sheet/issues/770
      activeOffsetY={[-5, 5]}
      enablePanDownToClose={enablePanDownToClose}
      enableHandlePanningGesture={enableHandlePanningGesture}
      touchBackdropBehavior={touchBackdropBehavior}
      backdrop={backdrop}
      backgroundStyle={[{ backgroundColor }, backgroundStyle]}
      handleComponent={handleComponent}
      handleIndicatorStyle={[
        { backgroundColor: handleIndicator },
        handleIndicatorStyle,
      ]}
      onClose={onClose}
      onDismiss={onDismiss}>
      {scrollEnabled ? (
        <BottomSheetScrollView
          scrollEnabled={scrollEnabled}
          contentContainerStyle={s.container}
          showsVerticalScrollIndicator={false}>
          {children}
        </BottomSheetScrollView>
      ) : (
        children
      )}
    </BottomSheet>
  );
});

const useStyles = makeStyles((__theme, _theme: AppTheme) => ({
  container: {
    height: '100%',
  },
}));

export { Modal };
