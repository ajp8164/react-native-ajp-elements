import { type AppTheme, useTheme, viewport } from '../../theme';
import type {
  CameraModalMethods,
  CameraModalProps,
  MediaCapture,
  OnCancelCallback,
  OnCaptureCallback,
  OnSelectCallback,
  PresentInterface,
} from './types';
import CameraView, {
  type CameraViewMethods,
  type MediaType,
  type PhotoFile,
  type VideoFile,
} from './views/CameraView';
import MediaView, {
  type MediaActionButton,
  type MediaViewMethods,
} from './views/MediaView';
import React, { useImperativeHandle, useRef } from 'react';
import { StatusBar, View } from 'react-native';

import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '../Modal';
import { ModalHeader } from '../ModalHeader';
import { makeStyles } from '@rn-vui/themed';
import { saveToCameraRoll } from './helpers';
import { selectImage } from '../../lib/imageSelect';
import { useSetState } from '@react-native-ajp-elements/core';

type CameraModal = CameraModalMethods;

const CameraModal = React.forwardRef<CameraModal, CameraModalProps>(
  (props, ref) => {
    const {
      actionButton: _actionButton,
      onCancel: _onCancel,
      onCapture: _onCapture,
      onSelect: _onSelect,
      preview: _preview,
    } = props;

    const theme = useTheme();
    const s = useStyles(theme);
    s;

    const innerRef = useRef<BottomSheetModalMethods>(null);
    const cameraViewRef = useRef<CameraViewMethods>(null);
    const mediaViewRef = useRef<MediaViewMethods>(null);

    const actionButton = useRef<MediaActionButton | undefined>(_actionButton);
    const onCancelCallback = useRef<OnCancelCallback | undefined>(_onCancel);
    const onCaptureCallback = useRef<OnCaptureCallback | undefined>(_onCapture);
    const onSelectCallback = useRef<OnSelectCallback | undefined>(_onSelect);
    const preview = useRef<boolean | undefined>(
      _preview === undefined ? true : false,
    );

    const [mediaCapture, setMediaCapture] = useSetState<{
      media: PhotoFile | VideoFile;
      type: MediaType;
      showMediaView: boolean;
      cameraRollUri: string | undefined;
    }>({
      media: {} as PhotoFile | VideoFile,
      type: 'photo',
      showMediaView: false,
      cameraRollUri: undefined,
    });

    useImperativeHandle(ref, () => ({
      // These functions exposed to the parent component through the ref.
      dismiss,
      present,
    }));

    const dismiss = () => {
      setMediaCapture({ showMediaView: false }, { assign: true });
      innerRef.current?.dismiss();
      StatusBar.setHidden(false);
    };

    const present = (args?: PresentInterface) => {
      args?.opts?.actionButton
        ? (actionButton.current = args?.opts?.actionButton)
        : undefined;
      args?.onCancel ? (onCancelCallback.current = args?.onCancel) : undefined;
      args?.onCapture
        ? (onCaptureCallback.current = args?.onCapture)
        : undefined;
      args?.onSelect ? (onSelectCallback.current = args?.onSelect) : undefined;
      args?.opts?.preview !== undefined
        ? (preview.current = args?.opts?.preview)
        : undefined;

      innerRef.current?.present();
      StatusBar.setHidden(true);
    };

    const onPreviewAction = async (mediaWidth: number, mediaHeight: number) => {
      mediaCapture.media.width = mediaWidth;
      mediaCapture.media.height = mediaHeight;

      const cameraRollUri = await saveToCameraRoll(
        mediaCapture.media.path,
        mediaCapture.type,
      );

      const ext = mediaCapture.media.path.split('.').pop();
      const mimeType =
        mediaCapture.type === 'photo' ? `image/${ext}` : `video/${ext}`;

      const capture = {
        cameraRoll: {
          uri: cameraRollUri,
        },
        media: mediaCapture.media,
        mimeType,
        type: mediaCapture.type,
      } as MediaCapture;

      onCaptureCallback.current && onCaptureCallback.current(capture);
      dismiss();
    };

    const onDismiss = () => {
      setMediaCapture({ showMediaView: false }, { assign: true });
      onCancelCallback.current && onCancelCallback.current();
    };

    const onMediaCaptured = (media: PhotoFile | VideoFile, type: MediaType) => {
      setMediaCapture(
        {
          media,
          type,
          showMediaView: preview.current,
        },
        { assign: true },
      );
    };

    const selectImages = () => {
      dismiss();
      selectImage({
        onSuccess: assets => {
          onSelectCallback.current && onSelectCallback.current(assets);
        },
        multiSelect: true,
      });
    };

    const retake = () => {
      setMediaCapture({ showMediaView: false }, { assign: true });
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
          size={'small'}
          blurBackground={true}
          containerStyle={s.headerContainer}
          leftButtonIcon={
            mediaCapture.showMediaView ? undefined : 'image-multiple-outline'
          }
          leftButtonIconColor={theme.colors.stickyWhite}
          leftButtonText={mediaCapture.showMediaView ? 'Retake' : undefined}
          leftButtonTextStyle={[s.headerButton, s.retakeButton]}
          onLeftButtonPress={() =>
            mediaCapture.showMediaView ? retake() : selectImages()
          }
          rightButtonText={'Done'}
          rightButtonTextStyle={[s.headerButton, s.doneButton]}
          onRightButtonPress={dismiss}
        />
        <CameraView ref={cameraViewRef} onMediaCaptured={onMediaCaptured} />
        {mediaCapture.showMediaView && (
          <View style={s.mediaView}>
            <MediaView
              ref={mediaViewRef}
              actionButton={actionButton.current}
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
    marginTop: 10,
  },
  mediaView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  doneButton: {
    ...theme.styles.textBold,
    color: theme.colors.warning,
  },
  retakeButton: {
    color: theme.colors.stickyWhite,
  },
}));

export { CameraModal };
