import type {
  BackdropPressBehavior,
  BottomSheetDefaultBackdropProps,
} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  type BottomSheetProps,
} from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';

import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { ConditionalWrapper } from './ConditionalWrapper';
import { PortalProvider } from '@gorhom/portal';

interface BottomSheetInterface extends BottomSheetProps {
  backdrop?: boolean;
  innerRef: React.RefObject<BottomSheetModalMethods | null>;
  modalParent?: boolean;
  onDismiss?: () => void;
  touchBackdropBehavior?: BackdropPressBehavior;
}

const BottomSheet = ({
  backdrop = true,
  children,
  innerRef,
  modalParent,
  onDismiss,
  touchBackdropBehavior = 'close',
  ...bottomSheetModalProps
}: BottomSheetInterface) => {
  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        pressBehavior={touchBackdropBehavior}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        {...props}
      />
    ),
    [],
  );

  // See https://github.com/gorhom/react-native-bottom-sheet/issues/832
  // for using <BottomSheetModalProvider><PortalProvider>
  return (
    <ConditionalWrapper
      condition={modalParent || false}
      wrapper={children => (
        <BottomSheetModalProvider>
          <PortalProvider>{children}</PortalProvider>
        </BottomSheetModalProvider>
      )}>
      <BottomSheetModal
        ref={innerRef}
        index={0}
        backdropComponent={backdrop ? renderBackdrop : () => null}
        stackBehavior={'push'}
        onDismiss={onDismiss}
        {...bottomSheetModalProps}>
        {children}
      </BottomSheetModal>
    </ConditionalWrapper>
  );
};

export { BottomSheet };
