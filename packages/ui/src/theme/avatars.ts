import {
  type Avatar,
  type AvatarImageCollection,
  type AvatarImageSource,
  AvatarKind,
} from '@react-native-ajp-elements/common';

import { AJPElements } from '@react-native-ajp-elements/core';

const defaultAvatar: Avatar = {
  id: '0',
  image: require('./img/avatars/default.png'),
  collection: 'default',
  kind: AvatarKind.PNG,
  style: {},
};

export const getAvatarCollectionName = (): string[] | undefined => {
  const avatarImageCollections = AJPElements.get<AvatarImageCollection[]>(
    'avatarImageCollections',
  );
  if (!avatarImageCollections) {
    return;
  }
  return avatarImageCollections.map((collection: AvatarImageCollection) => {
    return collection.name;
  });
};

export const getAvatars = (collectionName: string): Avatar[] | undefined => {
  const avatarImageCollections = AJPElements.get<AvatarImageCollection[]>(
    'avatarImageCollections',
  );
  if (!avatarImageCollections) {
    return;
  }

  const collection = avatarImageCollections.find(
    (collection: AvatarImageCollection) => {
      return collection.name === collectionName;
    },
  );

  return collection?.images.map((image: AvatarImageSource, index: number) => {
    return <Avatar>{
      id: `${index}`,
      collection: collection.name,
      image,
      kind: collection.kind,
      style: {},
    };
  });
};

export const getAvatar = (which?: {
  collection: string;
  id: string;
}): Avatar => {
  let avatar: Avatar | undefined;
  if (which) {
    const collection = getAvatars(which.collection);
    if (collection) {
      avatar = collection.find(avatar => {
        return avatar.id === which.id;
      });
    }
  }
  return avatar || defaultAvatar;
};
