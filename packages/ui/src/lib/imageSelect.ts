import * as ImagePicker from 'react-native-image-picker';

import { Alert } from 'react-native';
import { log } from '@react-native-ajp-elements/core';

/**
 * Select an image locally and respond with an image asset object.
 * @param args.onSuccess callback with an image asset
 * @param args.onError callback when an error occurs
 */
export const selectImage = (args: {
  onSuccess: (imageAssets: ImagePicker.Asset[]) => void;
  onError?: () => void;
  multiSelect?: boolean;
}) => {
  const { onSuccess, onError, multiSelect = false } = args;
  ImagePicker.launchImageLibrary(
    {
      mediaType: 'mixed',
      selectionLimit: multiSelect ? 0 : 1,
    },
    async response => {
      try {
        if (response.assets && response.assets[0]?.uri) {
          onSuccess(response.assets);
        } else if (response.errorCode) {
          const msg = `Image select error: ${response.errorCode} - ${response.errorMessage}`;
          if (response.errorCode.includes('permission')) {
            Alert.alert(
              'Permission Denied',
              "You don't have permission to access your photo library.\n\nYou can grant permission in your Settings app.",
              [{ text: 'OK' }],
              { cancelable: false },
            );
          } else {
            Alert.alert(
              'Image Selection Error',
              'An error occurred while accessing your photo library. Please try again.',
              [{ text: 'OK' }],
              { cancelable: false },
            );
            log.error(msg);
          }
          throw new Error(msg);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        onError && onError();
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ).catch((e: any) => {
    log.error(e.message);
    onError && onError();
  });
};
