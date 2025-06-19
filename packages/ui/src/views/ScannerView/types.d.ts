import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
export declare type ScannerView = ScannerViewMethods;

export interface ScannerViewProps {
  cameraStyle?: ViewStyle | ViewStyle[];
  containerStyle?: ViewStyle | ViewStyle[];
  OverlayComponent?: ReactNode;
  onCancel?: () => void;
  onScan: (data: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ScannerViewMethods {}
