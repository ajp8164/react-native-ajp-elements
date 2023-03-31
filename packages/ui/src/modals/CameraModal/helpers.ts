import { Alert, PermissionsAndroid, Platform } from 'react-native';

import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import type { MediaType } from './views/CameraView';
import { log } from '@react-native-ajp-elements/core';

const requestSavePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  if (permission == null) return false;

  let hasPermission = await PermissionsAndroid.check(permission);
  if (!hasPermission) {
    const permissionRequestResult = await PermissionsAndroid.request(
      permission,
    );
    hasPermission = permissionRequestResult === 'granted';
  }
  return hasPermission;
};

export const saveToCameraRoll = async (path: string, type: MediaType) => {
  const hasPermission = await requestSavePermission();
  if (!hasPermission) {
    Alert.alert(
      'Permission Denied',
      "You don't have permission to save to your photo library.\n\nYou can grant permission in your Settings app.",
    );
    return;
  }

  try {
    await CameraRoll.save(`file://${path}`, { type });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const t = type === 'photo' ? 'Photo' : 'Video';
    Alert.alert(
      `${t} Not Saved`,
      `An error occurred while saving your ${type}. Please try again.`,
    );
    log.error(`Failed to save to camera roll: ${e.message}`);
  }
};
