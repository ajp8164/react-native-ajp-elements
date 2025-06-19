import {
  ActivityIndicator,
  type ImageSourcePropType,
  type ImageStyle,
} from 'react-native';

import { Image } from '@rn-vui/base';
import RNCachedImage from 'react-native-image-cache-wrapper';
import React from 'react';
import { useTheme } from './theme';

const DAY = 86400;

export type GetSize = (
  url: string,
  success: (width: number, height: number) => void,
  failure?: (error: string) => Record<string, never>,
  retry?: {
    count: number;
    interval: number;
  },
) => void;

export const deleteCachedImage: (url: string) => void =
  // @ts-ignore
  RNCachedImage.deleteCache;
// @ts-ignore
export const getCachedImageSize: GetSize = RNCachedImage.getSize;

interface CachedImage {
  cache?: boolean;
  source: ImageSourcePropType;
  style?: ImageStyle[] | ImageStyle;
}

const CachedImage = ({ cache = true, source, style }: CachedImage) => {
  const theme = useTheme();

  if (cache) {
    return (
      <RNCachedImage
        source={source}
        expiration={30 * DAY}
        style={style}
        activityIndicator={
          <ActivityIndicator
            color={theme.colors.brandPrimary}
            style={theme.styles.activityIndicator}
          />
        }
      />
    );
  } else {
    return (
      <Image
        source={source}
        style={style}
        PlaceholderContent={
          <ActivityIndicator
            color={theme.colors.brandPrimary}
            style={theme.styles.activityIndicator}
          />
        }
      />
    );
  }
};

export { CachedImage };
