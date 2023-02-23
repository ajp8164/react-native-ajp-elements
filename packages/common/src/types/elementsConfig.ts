import type { AvatarImageCollection } from './avatar';
import type { SVGImages } from './image';

export type ElementsConfig = {
  avatarImageCollections?: AvatarImageCollection[];
  buildEnvironment?: string;
  sentryEndpoint?: string;
  sentryLoggingEnabled?: boolean;
  svgImages?: SVGImages;
  userId?: string;
};
