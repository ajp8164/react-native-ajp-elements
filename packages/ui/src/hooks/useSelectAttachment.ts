import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import { LibraryMediaType, selectImage } from '../lib/imageSelect';
import type { MediaAsset, MediaCapture } from '../modals/CameraModal';

import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { log } from '@react-native-ajp-elements/core';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useCamera } from '../camera';

export type Attachment = FileAttachment | ImageAttachment | VideoAttachment;

export interface FileAttachment {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  mimeType?: string;
  name: string;
  size?: number;
  type: 'file';
  uri: string;
}

export interface ImageAttachment {
  height?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  mimeType: string;
  name: string;
  size?: number;
  type: 'image';
  uri: string;
  width?: number;
}

export interface VideoAttachment {
  duration?: number;
  height?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  mimeType: string;
  name: string;
  size: number;
  posterUri?: string;
  type: 'video';
  uri: string;
  width?: number;
}

export const useSelectAttachments = (opts: {
  customButtonDestructive?: boolean;
  customButtonLabel?: string;
  selectFromCamera?: boolean;
  selectFromCameraRoll?: boolean;
  selectFromDocuments?: boolean;
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const camera = useCamera();

  const buttons: string[] = [];
  let cancelButtonIndex = 0;
  let selectFromCameraIndex = 99;
  let selectFromCameraRollIndex = 98;
  let selectFromDocumentsIndex = 97;
  let selectCustomIndex = 96;
  let customButtonDestructiveIndex = 96;

  if (opts.selectFromCamera) {
    buttons.push('Take Photo');
    cancelButtonIndex++;
    selectFromCameraIndex = cancelButtonIndex - 1;
  }
  // Select from the camera roll is the default.
  if (
    opts.selectFromCameraRoll !== undefined ? opts.selectFromCameraRoll : true
  ) {
    buttons.push('Choose Photos');
    cancelButtonIndex++;
    selectFromCameraRollIndex = cancelButtonIndex - 1;
  }
  if (opts.selectFromDocuments) {
    buttons.push('Choose Files');
    cancelButtonIndex++;
    selectFromDocumentsIndex = cancelButtonIndex - 1;
  }
  if (opts.customButtonLabel) {
    buttons.push(opts.customButtonLabel);
    cancelButtonIndex++;
    selectCustomIndex = cancelButtonIndex - 1;
    opts.customButtonDestructive
      ? (customButtonDestructiveIndex = selectCustomIndex)
      : null;
  }
  // There is always a cancel button.
  buttons.push('Cancel');

  return (opts: {
    cameraRollMediaType?: LibraryMediaType;
    multiSelect?: boolean;
    customButtonCallback?: () => void;
  }): Promise<Attachment[]> => {
    // Images and videos
    const chooseFromCameraRoll = (): Promise<Attachment[]> => {
      return new Promise<Attachment[]>((resolve, reject) => {
        selectImage({
          mediaType:
            opts.cameraRollMediaType !== undefined
              ? opts.cameraRollMediaType
              : 'photo',
          multiSelect: opts.multiSelect,
          onSuccess: async assets => {
            const attachments = await createAssetAttachments(assets);
            resolve(attachments);
          },
          onError: () => {
            reject([] as Attachment[]);
          },
        });
      });
    };

    // Take photo or video using camera
    const takePhoto = (): Promise<Attachment[]> => {
      return new Promise<Attachment[]>((resolve, _reject) => {
        camera.presentCameraModal({
          onCapture: async (capture: MediaCapture) => {
            const attachment = await createCaptureAttachment(capture);
            resolve([attachment]);
          },
          onSelect: async (assets: MediaAsset[]) => {
            const attachments = await createAssetAttachments(assets);
            resolve(attachments);
          },
        });
      });
    };

    // Files
    const chooseFiles = (): Promise<Attachment[]> => {
      return new Promise<Attachment[]>((resolve, reject) => {
        DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
          allowMultiSelection: opts.multiSelect,
        })
          .then(files => {
            const selections = files.map(f => {
              return {
                metadata: {},
                mimeType: f.type,
                name: f.name,
                size: f.size,
                type: 'file',
                uri: f.uri,
              } as FileAttachment;
            });
            resolve(selections as Attachment[]);
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((_e: any) => {
            reject([] as Attachment[]);
          });
      });
    };

    // User callback
    const userCallback = (): Promise<Attachment[]> => {
      return new Promise<Attachment[]>((resolve, _reject) => {
        opts.customButtonCallback && opts.customButtonCallback();
        resolve([]);
      });
    };

    const createAssetAttachments = async (
      assets: MediaAsset[],
    ): Promise<Attachment[]> => {
      const selections = [];
      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        if (asset.type?.includes('video')) {
          const posterUri = asset.uri && (await createVideoPoster(asset.uri));
          selections.push({
            duration: asset.duration,
            height: asset.height,
            metadata: {},
            mimeType: asset.type,
            name: asset.fileName,
            posterUri,
            size: asset.fileSize,
            type: 'video',
            uri: asset.uri,
            width: asset.width,
          } as VideoAttachment);
        } else {
          selections.push({
            height: asset.height,
            metadata: {},
            mimeType: asset.type,
            name: asset.fileName,
            size: asset.fileSize,
            type: 'image',
            uri: asset.uri,
            width: asset.width,
          } as ImageAttachment);
        }
      }
      return selections;
    };

    const createCaptureAttachment = async (
      capture: MediaCapture,
    ): Promise<Attachment> => {
      let attachment: Attachment;
      if (capture.type?.includes('video')) {
        const posterUri =
          capture.media.path && (await createVideoPoster(capture.media.path));
        attachment = {
          // duration: capture.media.duration,
          height: capture.media.height,
          metadata: {},
          mimeType: capture.mimeType,
          name: capture.media.path.split('/').pop(),
          posterUri,
          // size: capture.media.duration,
          type: 'video',
          uri: capture.media.path,
          width: capture.media.width,
        } as VideoAttachment;
      } else {
        attachment = {
          height: capture.media.height,
          metadata: {},
          mimeType: capture.mimeType,
          name: capture.media.path.split('/').pop(),
          // size: capture.media.size,
          type: 'image',
          uri: capture.media.path,
          width: capture.media.width,
        } as ImageAttachment;
      }
      return attachment;
    };

    const createVideoPoster = async (videoUri: string) => {
      const filename = videoUri.split('/').pop();
      const posterUri = `${RNFS.CachesDirectoryPath}/${filename}.png`;
      log.debug('Creating video poster...');
      return await FFmpegKit.execute(
        `-loglevel quiet -y -i ${videoUri} -frames:v 1 ${posterUri}`,
      ).then(async session => {
        const returnCode = await session.getReturnCode();
        if (ReturnCode.isSuccess(returnCode)) {
          log.debug('Done creating video poster');
          return `file://${posterUri}`;
        } else if (ReturnCode.isCancel(returnCode)) {
          // Canceled
        } else {
          log.debug('Error creating video poster');
          // Error
        }
        return;
      });
    };

    return new Promise<Attachment[]>((resolve, reject) => {
      showActionSheetWithOptions(
        {
          options: buttons,
          cancelButtonIndex,
          destructiveButtonIndex: customButtonDestructiveIndex,
        },
        buttonIndex => {
          switch (buttonIndex) {
            case selectFromCameraIndex:
              resolve(takePhoto());
              break;
            case selectFromCameraRollIndex:
              resolve(chooseFromCameraRoll());
              break;
            case selectFromDocumentsIndex:
              resolve(chooseFiles());
              break;
            case selectCustomIndex:
              resolve(userCallback());
              break;
            default:
              reject([] as Attachment[]);
          }
        },
      );
    });
  };
};
