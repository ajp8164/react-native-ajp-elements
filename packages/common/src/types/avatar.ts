import type { ImageSourcePropType } from 'react-native';

export type Avatar = {
  id: string;
  collection: string;
  image: ImageSourcePropType | string;
  kind: AvatarKind;
  style: object;
};

export enum AvatarKind {
  Gravatar = 'Gravatar',
  PNG = 'PNG',
}

export type GravatarName = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PNG = any;
export type AvatarImageSource = GravatarName | PNG;

export type AvatarImageCollection = {
  name: string;
  images: AvatarImageSource[];
  kind: AvatarKind;
};
