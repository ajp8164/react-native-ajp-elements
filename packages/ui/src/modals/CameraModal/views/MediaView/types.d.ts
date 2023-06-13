import { IconProps } from '@rneui/base';
import { MediaType } from '../CameraView';
import React from 'react';
import { ViewStyle } from 'react-native';

export declare type MediaView = MediaViewMethods;

declare const MediaView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    MediaViewProps & React.RefAttributes<MediaViewMethods>
  >
>;

export type MediaActionButton = {
  containerStyle?: ViewStyle | ViewStyle[];
  icon?: IconProps;
};

export interface MediaViewProps {
  // The action button prompting the user to use (capture) the media (image/video).
  actionButton?: MediaActionButton;
  // A callback when the action button is pressed.
  onPress?: (mediaWidth: number, mediaHeight: number) => void;
  // Filename for saving media (image/video).
  path: string;
  // Save the media in the camera roll when the action button is pressed.
  saveOnAction?: boolean;
  type: MediaType;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MediaViewMethods {}
