import { PhotoFile, VideoFile } from 'react-native-vision-camera';

import React from 'react';

export declare type CameraView = CameraViewMethods;

declare const CameraView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    CameraViewProps & React.RefAttributes<CameraViewMethods>
  >
>;

export interface CameraViewProps {
  onMediaCaptured: (media: PhotoFile | VideoFile, type: MediaType) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CameraViewMethods {}

export type MediaType = 'photo' | 'video' | 'auto';

export type MediaCapture = {
  media: PhotoFile | VideoFile;
  type: MediaType;
};
