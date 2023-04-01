import { Asset } from 'react-native-image-picker';
import { IconProps } from '@rneui/base';
import { MediaCapture } from './views/CameraView';
import React from 'react';

export declare type CameraModal = CameraModalMethods;

declare const CameraModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    CameraModalProps & React.RefAttributes<CameraModalMethods>
  >
>;

export interface CameraModalProps {
  actionButton?: {
    containerStyle?: ViewStyle | ViewStyle[];
    icon?: IconProps;
  };
  onCancel?: () => void;
  onCapture: (capture: MediaCapture) => void;
  onSelect: (assets: Asset[]) => void;
  preview?: boolean;
}

export interface CameraModalMethods {
  dismiss: () => void;
  present: () => void;
}
