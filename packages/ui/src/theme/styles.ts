import { Dimensions, Platform } from 'react-native';

import type { Styles } from './types/Styles';
import { Typography } from 'react-native-ui-lib';
import { makeStyles } from '@rn-vui/themed';

export const fontFamily =
  Platform.OS === 'ios' ? 'SFUIText-Regular' : 'SFUIText-Regular';

export const fontFamilyBold =
  Platform.OS === 'ios' ? 'SFUIText-Bold' : 'SFUIText-Bold';

export const fontFamilyLight =
  Platform.OS === 'ios' ? 'SFUIText-Light' : 'SFUIText-Light';

export const fontSizes = {
  tiny: 12,
  small: 14,
  normal: 16,
  large: 18,
  xl: 26,
  headingXL: 45,
  heading1: 30,
  heading2: 26,
  heading3: 22,
  heading4: 20,
  heading5: 18,
};

Typography.loadTypographies({
  // Segmented control text style within RNE.
  text90: {
    fontSize: fontSizes.tiny,
    fontFamily: fontFamilyBold,
  },
});

export const viewport = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
};

export const useStyles = makeStyles(
  (theme): Styles => ({
    extra: undefined,
    /**
     * Constants
     */
    headerBar: {
      ...Platform.select({
        android: {
          height: 44,
        },
        ios: {
          height: 44,
        },
      }),
    },
    headerBarLarge: {
      ...Platform.select({
        android: {
          height: 0,
        },
        ios: {
          height: 96,
        },
      }),
    },
    statusBar: {
      ...Platform.select({
        android: {
          height: 20,
        },
        ios: {
          height: 20,
        },
      }),
    },
    /**
     * List
     */
    listItemContainer: {
      backgroundColor: theme.colors.listItem,
      borderColor: theme.colors.listItemBorder,
      paddingLeft: 15,
      overflow: 'hidden',
    },
    listItemBorder: {
      marginLeft: 15,
      marginRight: 0,
      borderColor: theme.colors.listItemBorder,
    },
    listItemTitle: {
      color: theme.colors.text,
      fontSize: fontSizes.normal,
      fontFamily,
      minWidth: 150,
    },
    listItemSubtitle: {
      color: theme.colors.textDim,
      fontSize: fontSizes.small,
      fontFamily,
      fontWeight: 'normal',
    },
    listItemValue: {
      color: theme.colors.text,
      fontSize: fontSizes.normal,
      fontFamily,
      textAlign: 'right',
    },
    listItemIconProps: {
      name:
        Platform.OS === 'ios'
          ? 'chevron-forward-outline' // ionicon
          : 'keyboard-arrow-right', // material
      color: theme.colors.midGray,
      size: Platform.OS === 'ios' ? 20 : 25,
    },
    /**
     * Section list
     */
    sectionHeader: {
      height: 30,
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: theme.colors.listHeaderBackground,
    },
    sectionHeaderLabel: {
      color: theme.colors.textDim,
      fontSize: fontSizes.normal,
      fontFamily: fontFamily,
      top: 5,
    },
    /**
     * View
     */
    view: {
      height: '100%',
      paddingHorizontal: 15,
      backgroundColor: theme.colors.viewBackground,
    },
    viewAlt: {
      height: '100%',
      paddingHorizontal: 15,
      backgroundColor: theme.colors.viewAltBackground,
    },
    viewInv: {
      height: '100%',
      paddingHorizontal: 15,
      backgroundColor: theme.colors.viewInvBackground,
    },
    /**
     * Text
     */
    textHeadingXL: {
      color: theme.colors.text,
      marginVertical: 10,
      fontSize: fontSizes.headingXL,
      fontFamily: fontFamilyBold,
    },
    textHeading1: {
      color: theme.colors.text,
      marginVertical: 10,
      fontSize: fontSizes.heading1,
      fontFamily: fontFamilyBold,
    },
    textHeading2: {
      color: theme.colors.text,
      marginVertical: 10,
      fontSize: fontSizes.heading2,
      fontFamily: fontFamilyBold,
    },
    textHeading3: {
      color: theme.colors.text,
      marginVertical: 10,
      fontSize: fontSizes.heading3,
      fontFamily: fontFamilyBold,
    },
    textHeading4: {
      color: theme.colors.text,
      marginVertical: 4,
      fontSize: fontSizes.heading4,
      fontFamily: fontFamilyBold,
    },
    textHeading5: {
      color: theme.colors.text,
      marginVertical: 4,
      fontSize: fontSizes.heading5,
      fontFamily: fontFamilyBold,
    },
    textLarge: {
      color: theme.colors.text,
      fontSize: fontSizes.large,
      fontFamily,
      fontWeight: 'normal',
    },
    textXL: {
      color: theme.colors.text,
      fontSize: fontSizes.xl,
      fontFamily,
      fontWeight: 'normal',
    },
    textScreenTitle: {
      color: theme.colors.black,
      fontSize: 17,
      fontFamily,
      fontWeight: '600',
    },
    textNormal: {
      color: theme.colors.text,
      fontSize: fontSizes.normal,
      fontFamily,
      fontWeight: 'normal',
    },
    textSmall: {
      color: theme.colors.text,
      fontSize: fontSizes.small,
      fontFamily,
      fontWeight: 'normal',
    },
    textTiny: {
      color: theme.colors.text,
      fontSize: fontSizes.tiny,
      fontFamily,
      fontWeight: 'normal',
    },
    textLight: {
      fontFamily: fontFamilyLight,
      fontWeight: 'normal',
    },
    textBold: {
      fontFamily: fontFamilyBold,
      fontWeight: '600',
    },
    textDim: {
      opacity: 0.4,
    },
    textPlaceholder: {
      opacity: 0.4,
    },
    link: {
      color: theme.colors.textLink,
      textDecorationLine: 'underline',
      fontSize: fontSizes.normal,
      fontFamily,
    },
    /**
     * Button
     */
    button: {
      backgroundColor: theme.colors.brandPrimary,
      borderRadius: 50,
      height: 40,
      paddingHorizontal: 15,
      minWidth: 180,
    },
    buttonTitle: {
      color: theme.colors.white,
      fontSize: fontSizes.normal,
      fontFamily,
      ...Platform.select({
        ios: {
          marginTop: 0,
        },
        android: {
          marginTop: -2,
        },
      }),
    },
    buttonDisabled: {
      backgroundColor: theme.colors.brandPrimary,
      color: theme.colors.white,
      opacity: 0.5,
    },
    buttonClear: {
      backgroundColor: theme.colors.transparent,
      height: 40,
      paddingHorizontal: 15,
      minWidth: 180,
    },
    buttonClearTitle: {
      color: theme.colors.brandPrimary,
      fontSize: fontSizes.normal,
      fontFamily,
      ...Platform.select({
        ios: {
          marginTop: 0,
        },
        android: {
          marginTop: -2,
        },
      }),
    },
    buttonClearDisabled: {
      backgroundColor: theme.colors.transparent,
      color: theme.colors.brandPrimary,
      opacity: 0.5,
    },
    buttonOutline: {
      backgroundColor: theme.colors.transparent,
      height: 40,
      paddingHorizontal: 15,
      minWidth: 180,
      borderWidth: 1,
      borderRadius: 50,
      borderColor: theme.colors.brandPrimary,
    },
    buttonOutlineTitle: {
      color: theme.colors.brandPrimary,
      fontSize: fontSizes.normal,
      fontFamily,
      ...Platform.select({
        ios: {
          marginTop: 0,
        },
        android: {
          marginTop: -2,
        },
      }),
    },
    buttonOutlineDisabled: {
      backgroundColor: theme.colors.transparent,
      color: theme.colors.brandPrimary,
      opacity: 0.5,
    },
    buttonInvOutline: {
      backgroundColor: theme.colors.transparent,
      height: 40,
      paddingHorizontal: 15,
      minWidth: 180,
      borderWidth: 1,
      borderRadius: 50,
      borderColor: theme.colors.stickyWhite,
    },
    buttonInvOutlineTitle: {
      color: theme.colors.textInv,
      fontSize: fontSizes.normal,
      fontFamily,
      ...Platform.select({
        ios: {
          marginTop: 0,
        },
        android: {
          marginTop: -2,
        },
      }),
    },
    buttonInvOutlineDisabled: {
      backgroundColor: theme.colors.transparent,
      color: theme.colors.textInv,
      opacity: 0.5,
    },
    buttonInvClear: {
      backgroundColor: theme.colors.transparent,
      height: 40,
      paddingHorizontal: 15,
      minWidth: 180,
    },
    buttonInvClearTitle: {
      color: theme.colors.textInv,
      fontSize: fontSizes.normal,
      fontFamily,
      ...Platform.select({
        ios: {
          marginTop: 0,
        },
        android: {
          marginTop: -2,
        },
      }),
    },
    buttonInvClearDisabled: {
      backgroundColor: theme.colors.transparent,
      color: theme.colors.white,
      opacity: 0.5,
    },
    buttonScreenHeader: {
      backgroundColor: theme.colors.transparent,
      height: 40,
      paddingHorizontal: 0,
      minWidth: 0,
      justifyContent: 'flex-start',
    },
    buttonScreenHeaderTitle: {
      color: theme.colors.screenHeaderButtonText,
      fontSize: fontSizes.normal,
      fontFamily,
      ...Platform.select({
        ios: {
          marginTop: 0,
        },
        android: {
          marginTop: -2,
        },
      }),
    },
    buttonScreenHeaderDisabled: {
      backgroundColor: theme.colors.transparent,
      color: theme.colors.screenHeaderButtonText,
      opacity: 0.5,
    },
    buttonInvScreenHeader: {
      backgroundColor: theme.colors.transparent,
      height: 40,
      paddingHorizontal: 0,
      minWidth: 0,
      justifyContent: 'flex-start',
    },
    buttonInvScreenHeaderTitle: {
      color: theme.colors.stickyWhite,
      fontSize: fontSizes.normal,
      fontFamily,
      ...Platform.select({
        ios: {
          marginTop: 0,
        },
        android: {
          marginTop: -2,
        },
      }),
    },
    buttonInvScreenHeaderDisabled: {
      backgroundColor: theme.colors.transparent,
      color: theme.colors.stickyWhite,
      opacity: 0.5,
    },

    /**
     * Shadow
     */
    shadow: {
      shadowColor: theme.colors.stickyBlack,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.45,
          shadowRadius: 4.27,
        },
        android: {
          elevation: 10,
          backgroundColor: theme.colors.black,
        },
      }),
    },
    shadowGlow: {
      shadowColor: theme.colors.black,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.34,
          shadowRadius: 10,
        },
        android: {
          elevation: 10,
          backgroundColor: theme.colors.black,
        },
      }),
    },
    shadowShallow: {
      shadowColor: theme.colors.stickyBlack,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.45,
          shadowRadius: 2,
        },
        android: {
          elevation: 5,
          backgroundColor: theme.colors.black,
        },
      }),
    },
    activityIndicator: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.hintGray,
    },
  }),
);
