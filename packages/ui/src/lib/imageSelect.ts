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
    .then(result => {
      const selections = Array.isArray(result) ? result : [result];
      onSuccess(
        selections.map(i => {
          return {
            height: i.height,
            metadata: {
              created: i.creationDate,
              exif: i.exif,
              modified: i.modificationDate,
            },
            mimeType: i.mime,
            name: i.filename || '',
            size: i.size,
            type: mediaType,
            uri: i.path,
            width: i.width,
          };
        }),
      );
    })
    .catch(() => {
      onError && onError();
    });
};
