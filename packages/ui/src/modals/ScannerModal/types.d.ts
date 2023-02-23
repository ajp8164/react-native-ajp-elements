import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export declare type ScannerModal = ScannerModalMethods;

declare const ScannerModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    ScannerModalProps & React.RefAttributes<ScannerModalMethods>
  >
>;

export interface ScannerModalProps {
  modalParent?: boolean;
  onCancel?: () => void;
  onScan: (data: string) => void;
  snapPoints?: Array<string | number> | SharedValue<Array<string | number>>;
}

export interface ScannerModalMethods {
  dismiss: () => void;
  present: () => void;
}
