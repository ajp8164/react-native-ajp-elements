import { AppTheme, useTheme, viewport } from './theme';
import { Button, Icon } from '@rn-vui/base';
import { InputAccessoryView, Keyboard, View } from 'react-native';

import React from 'react';
import { makeStyles } from '@rn-vui/themed';

interface KeyboardAccessory {
  nextDisabled?: boolean;
  onDone?: () => void;
  onNext: () => void;
  onPrevious: () => void;
  previousDisabled?: boolean;
}

const KeyboardAccessory = ({
  nextDisabled,
  onDone,
  onNext,
  onPrevious,
  previousDisabled,
}: KeyboardAccessory) => {
  const theme = useTheme();
  const s = useStyles(theme);

  return (
    <InputAccessoryView nativeID={'inputAccessoryViewID'}>
      <View style={s.container}>
        <Button
          type={'clear'}
          icon={
            <Icon
              name="chevron-up-outline"
              type={'ionicon'}
              color={theme.colors.screenHeaderButtonText}
              size={28}
              disabled={previousDisabled}
              disabledStyle={{
                backgroundColor: theme.colors.transparent,
                opacity: 0.3,
              }}
            />
          }
          disabled={previousDisabled}
          onPress={onPrevious}
        />
        <Button
          type={'clear'}
          icon={
            <Icon
              name="chevron-down-outline"
              type={'ionicon'}
              color={theme.colors.screenHeaderButtonText}
              size={28}
              disabled={nextDisabled}
              disabledStyle={{
                backgroundColor: theme.colors.transparent,
                opacity: 0.3,
              }}
            />
          }
          disabled={nextDisabled}
          onPress={onNext}
        />
        <Button
          type={'clear'}
          title={'Done'}
          containerStyle={s.doneContainer}
          titleStyle={s.doneTitle}
          onPress={onDone || Keyboard.dismiss}
        />
      </View>
    </InputAccessoryView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  container: {
    flexDirection: 'row',
    height: 45,
    width: viewport.width,
    backgroundColor: theme.colors.viewBackground,
    borderTopColor: theme.colors.lightGray,
  },
  doneContainer: {
    position: 'absolute',
    top: 3,
    right: 10,
  },
  doneTitle: {
    ...theme.styles.textNormal,
    ...theme.styles.textBold,
    color: theme.colors.screenHeaderButtonText,
  },
}));

export { KeyboardAccessory };
