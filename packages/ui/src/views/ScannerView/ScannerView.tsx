import { AppTheme, useTheme } from '../../theme';
import React, { useImperativeHandle } from 'react';
import type { ScannerViewMethods, ScannerViewProps } from './types';

import { Button } from '@rneui/base';
import { Camera } from 'react-native-camera-kit';
import { View } from 'react-native';
import lodash from 'lodash';
import { makeStyles } from '@rneui/themed';

type ScannerView = ScannerViewMethods;

const ScannerView = React.forwardRef<ScannerView, ScannerViewProps>(
  (props, ref) => {
    const { onScan, onCancel } = props;

    const theme = useTheme();
    const s = useStyles(theme);

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
    }));

    // Prevent camera from calling us more than once on a scan.
    const success = lodash.debounce(
      (data: string) => {
        onScan(data);
      },
      1000,
      { leading: true, trailing: false },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onBarCodeRead = (event: any) => {
      success(event.nativeEvent.codeStringValue);
    };

    return (
      <View style={theme.styles.view}>
        <Camera
          style={s.camera}
          scanBarcode={true}
          onReadCode={onBarCodeRead}
        />
        <Button
          title={'Cancel'}
          titleStyle={s.buttonTitle}
          buttonStyle={[
            theme.styles.buttonInvOutline,
            { backgroundColor: theme.colors.transparent },
          ]}
          containerStyle={s.buttonContainer}
          onPress={onCancel}
        />
      </View>
    );
  },
);

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },
  buttonTitle: {
    ...theme.styles.buttonTitle,
    color: theme.colors.stickyWhite,
  },
}));

export { ScannerView };
