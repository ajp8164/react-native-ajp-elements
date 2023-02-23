import type { TextStyle, ViewStyle } from 'react-native';

import type { IconProps } from 'react-native-vector-icons/Icon';

export type Styles = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra: any; // Used by components to pass arbitrary props to makeStyles()

  listItemContainer: ViewStyle;
  listItemTitle: TextStyle;
  listItemSubtitle: TextStyle;
  listItemValue: TextStyle;
  listItemIconProps: IconProps;

  view: ViewStyle;
  viewAlt: ViewStyle;
  viewInv: ViewStyle;

  textHeadingXL: TextStyle;
  textHeading1: TextStyle;
  textHeading2: TextStyle;
  textHeading3: TextStyle;
  textHeading4: TextStyle;
  textHeading5: TextStyle;
  textXL: TextStyle;
  textLarge: TextStyle;
  textNormal: TextStyle;
  textSmall: TextStyle;
  textTiny: TextStyle;
  textLight: TextStyle;
  textBold: TextStyle;
  textDim: TextStyle;
  textPlaceholder: TextStyle;

  sectionHeader: ViewStyle;
  sectionHeaderLabel: TextStyle;

  link: TextStyle;
  button: ViewStyle;
  buttonTitle: TextStyle;
  buttonDisabled: ViewStyle | TextStyle;
  buttonClear: ViewStyle;
  buttonClearTitle: TextStyle;
  buttonClearDisabled: ViewStyle | TextStyle;
  buttonOutline: ViewStyle;
  buttonOutlineTitle: TextStyle;
  buttonOutlineDisabled: ViewStyle | TextStyle;
  buttonInvOutline: ViewStyle;
  buttonInvOutlineTitle: TextStyle;
  buttonInvOutlineDisabled: ViewStyle | TextStyle;
  buttonInvClear: ViewStyle;
  buttonInvClearTitle: TextStyle;
  buttonInvClearDisabled: ViewStyle | TextStyle;

  shadow: ViewStyle;
  shadowGlow: ViewStyle;
  shadowShallow: ViewStyle;
  activityIndicator: ViewStyle;
};
