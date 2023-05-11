import type { Asset } from 'react-native-image-picker';
import type { MediaActionButton } from './views/MediaView';
import type { MediaCapture } from './views/CameraView';
import React from 'react';

export declare type CameraModal = CameraModalMethods;

declare const CameraModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    CameraModalProps & React.RefAttributes<CameraModalMethods>
  >
>;

export type MediaAsset = Asset;
export type OnCancelCallback = () => void;
export type OnCaptureCallback = (capture: MediaCapture) => void;
export type OnSelectCallback = (assets: MediaAsset[]) => void;

// present() has this interface as an option to using component props.
export type PresentInterface = {
  onCancel?: OnCancelCallback;
  onCapture?: OnCaptureCallback;
  onSelect?: OnSelectCallback;
  opts?: {
    preview?: boolean;
    actionButton?: MediaActionButton;
  };
};

export interface CameraModalProps {
  // The action button prompting the user to use (capture) the media (image/video).
  actionButton?: MediaActionButton;
  // Callback when the camera modal is canceled/closed.
  onCancel?: OnCancelCallback;
  // Callback when an image/video is captured. Only called when preview is set true.
  onCapture?: OnCaptureCallback;
  // Callback when one more images/videos are selected from the camera roll.
  onSelect?: OnSelectCallback;
  // When true, the modal will capture the image/video with an action button for handling
  // the image/video (e.g. saving to camera roll).
  preview?: boolean;
}

export interface CameraModalMethods {
  dismiss: () => void;
  present: (args?: PresentInterface) => void;
}
