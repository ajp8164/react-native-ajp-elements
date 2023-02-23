import React, { useImperativeHandle, useRef } from 'react';
import type { ScannerModalMethods, ScannerModalProps } from './types';

import { BottomSheet } from '../../BottomSheet';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { ScannerView } from '../../views/ScannerView';
import { useTheme } from '../../theme';

type ScannerModal = ScannerModalMethods;

const ScannerModal = React.forwardRef<ScannerModal, ScannerModalProps>(
  (props, ref) => {
    const {
      modalParent = false,
      snapPoints = ['92%'],
      onScan,
      onCancel = () => {
        return;
      },
    } = props;

    const theme = useTheme();
    const innerRef = useRef<BottomSheetModalMethods>(null);

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
      dismiss,
      present,
    }));

    const dismiss = () => {
      innerRef.current?.dismiss();
      onCancel();
    };

    const present = () => {
      innerRef.current?.present();
    };

    const success = (data: string) => {
      innerRef.current?.dismiss();
      onScan(data);
    };

    return (
      <BottomSheet
        innerRef={innerRef}
        modalParent={modalParent}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: theme.colors.stickyBlack,
        }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.stickyWhite }}>
        <ScannerView onScan={success} onCancel={dismiss} />
      </BottomSheet>
    );
  },
);

export { ScannerModal };
