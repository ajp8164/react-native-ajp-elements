import '@rneui/themed';

export interface ColorSet {
  readonly brandPrimary: string;
  readonly brandSecondary: string;

  readonly stickyWhite: string;
  readonly stickyBlack: string;
  readonly transparent: string;

  readonly text: string;
  readonly textLight: string;
  readonly textDim: string;
  readonly textInv: string;
  readonly textLink: string;
  readonly textLinkInv: string;
  readonly textPlaceholder: string;

  readonly icon: string;
  readonly iconInv: string;

  readonly darkGray: string;
  readonly midGray: string;
  readonly lightGray: string;
  readonly subtleGray: string;
  readonly hintGray: string;
  readonly wispGray: string;

  readonly blackTransparentDarker: string;
  readonly blackTransparentDark: string;
  readonly blackTransparentMid: string;
  readonly blackTransparentLight: string;
  readonly blackTransparentSubtle: string;

  readonly whiteTransparentDarker: string;
  readonly whiteTransparentDark: string;
  readonly whiteTransparentMid: string;
  readonly whiteTransparentLight: string;
  readonly whiteTransparentSubtle: string;

  readonly warning: string;
  readonly success: string;
  readonly assertive: string;
  readonly assertiveInv: string;
  readonly calm: string;

  readonly avatarBorder: string;

  readonly bottomSheetBackground: string;

  readonly button: string;
  readonly buttonText: string;
  readonly buttonInv: string;

  readonly listHeaderBackground: string;
  readonly listHeaderTextBackground: string;
  readonly listItem: string;
  readonly listItemBorder: string;
  readonly listItemAlt: string;
  readonly listItemIcon: string;

  readonly divider: string;

  readonly screenHeaderTitle: string;
  readonly screenHeaderBackground: string;
  readonly screenHeaderInvBackground: string;
  readonly screenHeaderButtonText: string;
  readonly screenHeaderInvButtonText: string;

  readonly viewBackground: string;
  readonly viewAltBackground: string;
  readonly viewInvBackground: string;

  readonly activeTabBackground: string;
  readonly inactiveTabBackground: string;
  readonly tabBarBorder: string;

  readonly switchOffThumb: string;
  readonly switchOnThumb: string;
  readonly switchOffTrack: string;
  readonly switchOnTrack: string;
}

declare module '@rneui/themed' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Colors extends ColorSet {}
}
