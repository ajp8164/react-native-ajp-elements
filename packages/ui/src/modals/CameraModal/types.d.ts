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
  onPreviewAction?: (capture: MediaCapture) => void;
  onDismiss?: () => void;
  preview?: boolean;
}

export interface CameraModalMethods {
  dismiss: () => void;
  present: () => void;
}
