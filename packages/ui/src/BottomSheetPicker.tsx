import { Picker, type PickerInterface } from './Picker';

import { BottomSheet } from './BottomSheet';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

interface BottomSheetPickerInterface extends PickerInterface {
  backgroundStyle?: ViewStyle;
  handleIndicatorStyle?: ViewStyle;
  innerRef: React.RefObject<BottomSheetModalMethods>;
  modalParent?: boolean;
  onDismiss?: () => void;
  snapPoints?: Array<string | number> | SharedValue<Array<string | number>>;
}

const BottomSheetPicker = ({
  backgroundStyle,
  handleIndicatorStyle,
  innerRef,
  modalParent,
  onDismiss = () => {
    return;
  },
  snapPoints = [275, '70%'],
  ...pickerProps
}: BottomSheetPickerInterface) => {
  return (
    <BottomSheet
      innerRef={innerRef}
      modalParent={modalParent}
      snapPoints={snapPoints}
      onDismiss={onDismiss}
      backgroundStyle={backgroundStyle}
      handleIndicatorStyle={handleIndicatorStyle}>
      <Picker {...pickerProps} />
    </BottomSheet>
  );
};

export { BottomSheetPicker };
