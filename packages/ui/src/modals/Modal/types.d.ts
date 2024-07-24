import React, { ReactNode } from 'react';

import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { SharedValue } from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

export declare type Modal = ModalMethods;

declare const Modal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    ModalProps & React.RefAttributes<ModalMethods>
  >
>;

export interface ModalProps {
  backgroundStyle?: ViewStyle;
  children: ReactNode;
  background?: 'normal' | 'inverse';
  enableGestureBehavior?: boolean;
  handleComponent?: React.FC<BottomSheetHandleProps> | null | undefined;
  handleIndicatorStyle?: ViewStyle;
  modalParent?: boolean;
  onClose?: () => void; // Close only
  onDismiss?: () => void; // Close and unmount
  scrollEnabled?: boolean;
  snapPoints?: Array<string | number> | SharedValue<Array<string | number>>;
}

export interface ModalMethods extends BottomSheetModalMethods {
  collapse: () => void;
  close: () => void;
  dismiss: () => void;
  expand: () => void;
  forceClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  present: (data?: any) => void;
  snapToIndex: (index: number) => void;
  snapToPosition: (position: string | number) => void;
}
