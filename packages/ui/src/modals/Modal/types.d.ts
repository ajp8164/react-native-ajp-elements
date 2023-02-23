import React, { ReactNode } from 'react';

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
  handleIndicatorStyle?: ViewStyle;
  modalParent?: boolean;
  onClose?: () => void; // Close only
  onDismiss?: () => void; // Close and unmount
  scrollEnabled?: boolean;
  snapPoints?: Array<string | number> | SharedValue<Array<string | number>>;
}

export interface ModalMethods {
  close: () => void;
  dismiss: () => void;
  present: () => void;
}
