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

export interface MediaViewProps {
  actionButton?: {
    containerStyle?: ViewStyle | ViewStyle[];
    icon?: IconProps;
  };
  onPress?: () => void;
  path: string;
  saveOnAction?: boolean;
  type: MediaType;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MediaViewMethods {}
