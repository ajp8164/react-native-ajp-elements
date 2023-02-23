import { CreateThemeOptions, createTheme } from '@rneui/themed';

import { Platform } from 'react-native';

export const theme: CreateThemeOptions = {
  darkColors: {
    brandPrimary: '#005eb8',
    brandSecondary: '#002e5a',

    white: '#000000',
    black: '#ffffffde',
    stickyWhite: '#ffffff',
    stickyBlack: '#000000',
    transparent: '#00000000',

    text: '#ffffffde',
    textLight: '#878787',
    textDim: '#878787',
    textInv: '#ffffffde',
    textLink: '#005eb8',
    textLinkInv: '#ffffffde',
    textPlaceholder: '#878787',

    icon: '#555555',
    iconInv: '#ffffff',

    darkGray: '#ffffffde',
    midGray: '#787878',
    lightGray: '#787878',
    subtleGray: '#101010',
    hintGray: '#101010',
    wispGray: '#101010',

    blackTransparentDarker: 'rgba(255, 255, 255, 0.9)',
    blackTransparentDark: 'rgba(255, 255, 255, 0.7)',
    blackTransparentMid: 'rgba(255, 255, 255, 0.5)',
    blackTransparentLight: 'rgba(255, 255, 255, 0.3)',
    blackTransparentSubtle: 'rgba(255, 255, 255, 0.05)',

    whiteTransparentDarker: 'rgba(0, 0, 0, 0.8)',
    whiteTransparentDark: 'rgba(0, 0, 0, 0.7)',
    whiteTransparentMid: 'rgba(0, 0, 0, 0.4)',
    whiteTransparentLight: 'rgba(0, 0, 0, 0.2)',
    whiteTransparentSubtle: 'rgba(0, 0, 0, 0.1)',

    primary: '#005eb8',
    warning: '#f8c829',
    success: '#00a000',
    error: '#c00000',
    assertive: '#c00000',
    assertiveInv: '#f8c829',
    calm: '#005eb8',

    avatarBorder: '#787878',

    bottomSheetBackground: '#202020',

    button: '#005eb8',
    buttonText: '#ffffffde',
    buttonInv: '#002e5a',

    listHeaderBackground: '#000000',
    listHeaderTextBackground: '#000000',
    listItem: '#101010',
    listItemBorder: '#202020',
    listItemAlt: '#000000',
    listItemIcon: '#878787',

    divider: '#202020',

    screenHeaderText: '#ffffffde',
    screenHeaderBackground: '#000000',
    screenHeaderInvBackground: '#002e5a',

    viewBackground: '#000000',
    viewAltBackground: '#000000',
    viewInvBackground: '#002e5a',

    activeTabBackground: '#000000',
    inactiveTabBackground: '#000000',
    tabBarBorder: '#202020',

    ...Platform.select({
      ios: {
        switchOffThumb: '#ffffff',
        switchOnThumb: '#ffffff',
        switchOffTrack: '#e5e5e5',
        switchOnTrack: '#005eb8',
        screenHeaderBackButton: '#005eb8',
        screenHeaderInvBackButton: '#ffffffde',
      },
      android: {
        switchOffThumb: '#787878',
        switchOnThumb: '#005eb8',
        switchOffTrack: '#e5e5e5',
        switchOnTrack: '#005eb840',
        screenHeaderBackButton: '#ffffffde',
        screenHeaderInvBackButton: '#ffffffde',
      },
    }),
  },
  lightColors: {
    brandPrimary: '#005eb8',
    brandSecondary: '#002e5a',

    white: '#ffffff',
    black: '#000000',
    stickyWhite: '#ffffff',
    stickyBlack: '#000000',
    transparent: '#00000000',

    text: '#101010',
    textLight: '#787878',
    textDim: '#aaaaaa',
    textInv: '#ffffff',
    textLink: '#002e5a',
    textLinkInv: '#ffffff',
    textPlaceholder: '#878787',

    icon: '#aaaaaa',
    iconInv: '#ffffff',

    darkGray: '#545454',
    midGray: '#787878',
    lightGray: '#aaaaaa',
    subtleGray: '#e5e5e5',
    hintGray: '#f0f0f0',
    wispGray: '#f8f8f8',

    blackTransparentDarker: 'rgba(0, 0, 0, 0.8)',
    blackTransparentDark: 'rgba(0, 0, 0, 0.7)',
    blackTransparentMid: 'rgba(0, 0, 0, 0.4)',
    blackTransparentLight: 'rgba(0, 0, 0, 0.2)',
    blackTransparentSubtle: 'rgba(0, 0, 0, 0.1)',

    whiteTransparentDarker: 'rgba(255, 255, 255, 0.9)',
    whiteTransparentDark: 'rgba(255, 255, 255, 0.7)',
    whiteTransparentMid: 'rgba(255, 255, 255, 0.5)',
    whiteTransparentLight: 'rgba(255, 255, 255, 0.3)',
    whiteTransparentSubtle: 'rgba(255, 255, 255, 0.05)',

    primary: '#005eb8',
    warning: '#f8c829',
    success: '#00a000',
    error: '#c00000',
    assertive: '#c00000',
    assertiveInv: '#f8c829',
    calm: '#002e5a',

    avatarBorder: '#787878',

    bottomSheetBackground: '#f0f0f0',

    button: '#005eb8',
    buttonText: '#ffffff',
    buttonInv: '#002e5a',

    listHeaderBackground: '#f0f0f0',
    listHeaderTextBackground: '#f0f0f0',
    listItem: '#ffffff',
    listItemBorder: '#aaaaaa',
    listItemAlt: '#f0f0f0',
    listItemIcon: '#aaaaaa',

    divider: '#e5e5e5',

    screenHeaderText: '#000000',
    screenHeaderBackground: '#ffffff',
    screenHeaderInvBackground: '#002e5a',

    viewBackground: '#f0f0f0',
    viewAltBackground: '#ffffff',
    viewInvBackground: '#002e5a',

    activeTabBackground: '#ffffff',
    inactiveTabBackground: '#ffffff',
    tabBarBorder: '#aaaaaa',

    ...Platform.select({
      ios: {
        switchOffThumb: '#ffffff',
        switchOnThumb: '#ffffff',
        switchOffTrack: '#787878',
        switchOnTrack: '#005eb8',
        screenHeaderBackButton: '#005eb8',
        screenHeaderInvBackButton: '#ffffff',
      },
      android: {
        switchOffThumb: '#cccccc',
        switchOnThumb: '#005eb8',
        switchOffTrack: '#787878',
        switchOnTrack: '#005eb840',
        screenHeaderBackButton: '#000000',
        screenHeaderInvBackButton: '#ffffff',
      },
    }),
  },
};

createTheme(theme);
