import { AppTheme, useTheme, viewport } from '../../theme';
import type { CameraModalMethods, CameraModalProps } from './types';
import CameraView, { CameraViewMethods, MediaType } from './views/CameraView';
import MediaView, { MediaViewMethods } from './views/MediaView';
import type { PhotoFile, VideoFile } from 'react-native-vision-camera';
import React, { useImperativeHandle, useRef } from 'react';
import { StatusBar, View } from 'react-native';

import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '../Modal';
import { ModalHeader } from '../ModalHeader';
import { makeStyles } from '@rneui/themed';
import { saveToCameraRoll } from './helpers';
import { useSetState } from '@react-native-ajp-elements/core';

type CameraModal = CameraModalMethods;

const CameraModal = React.forwardRef<CameraModal, CameraModalProps>(
  (props, ref) => {
    const {
      actionButton,
      onPreviewAction: callerOnAction,
      onDismiss: callerOnDismiss,
      preview,
    } = props;

    const theme = useTheme();
    const s = useStyles(theme);
    s;

    const innerRef = useRef<BottomSheetModalMethods>(null);
    const cameraViewRef = useRef<CameraViewMethods>(null);
    const mediaViewRef = useRef<MediaViewMethods>(null);

    const [mediaCapture, setMediaCapture] = useSetState<{
      media: PhotoFile | VideoFile;
      type: MediaType;
      showMediaView: boolean;
    }>({
      media: {} as PhotoFile | VideoFile,
      type: 'photo',
      showMediaView: false,
    });

    useImperativeHandle(ref, () => ({
      // These functions exposed to the parent component through the ref.
      dismiss,
      present,
    }));

    const dismiss = () => {
      setMediaCapture({ showMediaView: false });
      innerRef.current?.dismiss();
      StatusBar.setHidden(false);
    };

    const present = () => {
      innerRef.current?.present();
      StatusBar.setHidden(true);
    };

    const onPreviewAction = () => {
      callerOnAction &&
        callerOnAction({
          media: mediaCapture.media,
          type: mediaCapture.type,
        });
      dismiss();
    };

    const onDismiss = () => {
      setMediaCapture({ showMediaView: false });
      callerOnDismiss && callerOnDismiss();
    };

    const onMediaCaptured = (media: PhotoFile | VideoFile, type: MediaType) => {
      setMediaCapture({
        media,
        type,
        showMediaView: preview,
      });

      !preview && saveToCameraRoll(media.path, type);
    };

    const retake = () => {
      setMediaCapture({ showMediaView: false });
    };

    return (
      <Modal
        ref={innerRef}
        snapPoints={[viewport.height + 50]}
        onDismiss={onDismiss}
        scrollEnabled={false}
        enableGestureBehavior={false}
        handleComponent={null}>
        <ModalHeader
          containerStyle={s.headerContainer}
          leftButtonText={'Retake'}
          leftButtonTextStyle={[
            s.headerButton,
            s.retakeButton,
            { opacity: mediaCapture.showMediaView ? 1 : 0 },
          ]}
          onLeftButtonPress={() =>
            mediaCapture.showMediaView ? retake() : null
          }
          rightButtonText={'Done'}
          rightButtonTextStyle={s.headerButton}
          onRightButtonPress={dismiss}
        />
        <CameraView ref={cameraViewRef} onMediaCaptured={onMediaCaptured} />
        {mediaCapture.showMediaView && (
          <View style={s.mediaView}>
            <MediaView
              ref={mediaViewRef}
              actionButton={actionButton}
              path={mediaCapture.media.path}
              type={mediaCapture.type}
              onPress={onPreviewAction}
            />
          </View>
        )}
      </Modal>
    );
  },
);

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  headerContainer: {
    position: 'absolute',
    top: theme.insets.top - 20,
    zIndex: 1,
    width: '100%',
  },
  headerButton: {
    ...theme.styles.textBold,
    color: theme.colors.stickyWhite,
    marginTop: 10,
    backgroundColor: theme.colors.blackTransparentMid,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  mediaView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  retakeButton: {
    color: theme.colors.warning,
  },
}));

export { CameraModal };
