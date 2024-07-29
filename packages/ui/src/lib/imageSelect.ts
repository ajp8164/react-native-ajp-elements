import ImagePicker from 'react-native-image-crop-picker';

export type LibraryMediaType = 'video' | 'photo' | 'any';

export type Asset = {
  height: number;
  metadata: {
    created?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exif: any;
    modified?: string;
  };
  mimeType: string;
  name: string;
  size: number;
  type: LibraryMediaType;
  uri: string;
  width: number;
  duration?: number;
};

/**
 * Select an image locally and respond with an image asset object.
 * @param args.onSuccess callback with an image asset
 * @param args.onError callback when an error occurs
 */
export const selectImage = (args: {
  // onSuccess: (imageAssets: ImagePicker.Asset[]) => void;
  onSuccess: (imageAssets: Asset[]) => void;
  onError?: () => void;
  mediaType?: LibraryMediaType;
  multiSelect?: boolean;
  cropRect?: { height: number; width: number };
}) => {
  const {
    onSuccess,
    onError,
    mediaType = 'any',
    multiSelect = false,
    cropRect,
  } = args;
  ImagePicker.openPicker({
    width: cropRect?.width,
    height: cropRect?.height,
    cropping: !!cropRect,
    multiple: multiSelect,
    mediaType,
  })
    .then(image => {
      if (Array.isArray(image))
        onSuccess([
          {
            height: image.height,
            metadata: {
              created: image.creationDate,
              exif: image.exif,
              modified: image.modificationDate,
            },
            mimeType: image.mime,
            name: image.filename || '',
            size: image.size,
            type: mediaType,
            uri: image.path,
            width: image.width,
          },
        ]);
    })
    .catch(() => {
      onError && onError();
    });
  // ImagePicker.launchImageLibrary(
  //   {
  //     mediaType,
  //     selectionLimit: multiSelect ? 0 : 1,
  //     assetRepresentationMode: 'current',
  //   },
  //   async response => {
  //     try {
  //       if (response.assets && response.assets[0]?.uri) {
  //         onSuccess(response.assets);
  //       } else if (response.errorCode) {
  //         const msg = `Image select error: ${response.errorCode} - ${response.errorMessage}`;
  //         if (response.errorCode.includes('permission')) {
  //           Alert.alert(
  //             'Permission Denied',
  //             "You don't have permission to access your photo library.\n\nYou can grant permission in your Settings app.",
  //             [{ text: 'OK' }],
  //             { cancelable: false },
  //           );
  //         } else {
  //           Alert.alert(
  //             'Image Selection Error',
  //             'An error occurred while accessing your photo library. Please try again.',
  //             [{ text: 'OK' }],
  //             { cancelable: false },
  //           );
  //           log.error(msg);
  //         }
  //         throw new Error(msg);
  //       }
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     } catch (e: any) {
  //       onError && onError();
  //     }
  //   },
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // ).catch((e: any) => {
  //   log.error(e.message);
  //   onError && onError();
  // });
};
