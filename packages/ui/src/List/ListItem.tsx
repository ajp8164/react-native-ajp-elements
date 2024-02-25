import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { type AppTheme, useTheme } from '../theme';
import { Avatar, Badge, Icon, ListItem as RNEListItem } from '@rneui/base';
import {
  type ColorValue,
  type ImageSourcePropType,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { AppleStyleSwipeableRow } from './AppleSwipeableRow';
import type { Swipeable } from 'react-native-gesture-handler';
import type { SwipeableItem } from '.';
import { makeStyles } from '@rneui/themed';

const dragHandleWidth = 44;
const editButtonWidth = 44;

// Editable example - action to swipeable delete
//
// Set the 'action' property set to 'open-swipeable'.
//
//   editable={{
//     item: {
//       icon: 'remove-circle',
//       color: theme.colors.assertive,
//       action: 'open-swipeable',
//     },
//   }}

// Editable example - selection
//
// Setup a selections array in state. Use the index in the list as the selection index.
//
//   const [selected, setSelected] = useState<boolean[]>(Array(actions.length).fill(false));
//
// Make item icon and color dependent on the selection. Update the selection array in state to
// rerender the list to update the icon.
//
//   editable={{
//     item: {
//       icon: selected[index] ? 'checkmark-circle' : 'ellipse-outline',
//       color: selected[index] ? theme.colors.success : theme.colors.subtleGray,
//     },
//     onEditItem: () => {
//       setSelected(prevState => {
//         const updated = ([] as boolean[]).concat(prevState);
//         updated[index] = !prevState[index];
//         return updated;
//       });
//     },
//   }}
//

// 'imageType' specifies a valid RNE icon set
// See https://reactnativeelements.com/docs/components/icon#available-icon-sets

interface ListItem {
  alignContent?: 'middle' | 'top';
  badgeStatus?: 'primary' | 'success' | 'warning' | 'error';
  badgeValue?: string;
  bottomDividerColor?: string;
  bottomDividerLeft?: number;
  bottomDividerRight?: number;
  containerStyle?: ViewStyle | ViewStyle[];
  delayLongPress?: number;
  disabled?: boolean;
  disabledStyle?: ViewStyle | ViewStyle[];
  drag?: () => void; // The drag() method from react-native-draggable-flat-list.
  editable?: {
    item?: {
      icon: string;
      color?: ColorValue;
      action?: 'open-swipeable';
    };
    onEditItem?: () => void;
    reorder: boolean;
  };
  extraContentComponent?: JSX.Element;
  leftContainerStyle?: ViewStyle | ViewStyle[];
  leftImage?: ImageSourcePropType | JSX.Element | string;
  leftImageColor?: string;
  leftImageSize?: number;
  leftImageType?: string;
  onLongPress?: () => void;
  onPress?: () => void;
  onSwipeableClose?: (
    direction: 'left' | 'right',
    swipeable: Swipeable,
  ) => void;
  onSwipeableOpen?: (direction: 'left' | 'right', swipeable: Swipeable) => void;
  onSwipeableWillClose?: (direction: 'left' | 'right') => void;
  onSwipeableWillOpen?: (direction: 'left' | 'right') => void;
  placeholder?: string;
  position?: ('first' | 'last' | undefined)[];
  rightImage?: ImageSourcePropType | JSX.Element | string | boolean;
  rightImageColor?: string;
  rightImageSize?: number;
  rightImageType?: string;
  showEditor?: boolean;
  swipeable?: {
    leftItems?: SwipeableItem[];
    rightItems?: SwipeableItem[];
  };
  subtitle?: string | JSX.Element;
  subtitleNumberOfLines?: number;
  subtitleStyle?: TextStyle | TextStyle[];
  title?: string | JSX.Element;
  titleNumberOfLines?: number;
  titleStyle?: TextStyle | TextStyle[];
  value?: string | JSX.Element;
  valueStyle?: TextStyle | TextStyle[];
  zeroEdgeContent?: boolean;
}

export interface ListItemMethods {
  resetEditor: () => void;
}

const ListItem = React.forwardRef<ListItemMethods, ListItem>(
  (
    {
      alignContent = 'middle',
      badgeStatus = 'primary',
      badgeValue,
      bottomDividerColor,
      bottomDividerLeft = 0,
      bottomDividerRight = 0,
      containerStyle,
      delayLongPress,
      disabled,
      disabledStyle = { opacity: 0.3 },
      drag,
      editable,
      showEditor = false,
      swipeable,
      extraContentComponent,
      leftContainerStyle,
      leftImage,
      leftImageColor,
      leftImageSize,
      leftImageType = 'ionicon',
      onLongPress,
      onPress,
      onSwipeableClose,
      onSwipeableOpen,
      onSwipeableWillClose,
      onSwipeableWillOpen,
      placeholder = '\u00b7\u00b7\u00b7',
      position,
      rightImage = true,
      rightImageColor,
      rightImageSize,
      rightImageType = 'ionicon',
      subtitle,
      subtitleNumberOfLines,
      subtitleStyle,
      title,
      titleNumberOfLines,
      titleStyle,
      value,
      valueStyle,
      zeroEdgeContent,
    },
    ref,
  ) => {
    const theme = useTheme();
    const s = useStyles(theme);

    bottomDividerColor = bottomDividerColor || theme.colors.listItemBorder;

    const swipeableRef = useRef<Swipeable>(null);
    const [rerender, setRerender] = useState(false);

    const showDrag = !editable && drag; // Whether or not the drag handle should be shown regardless of editing.
    const dragHandleX = useSharedValue(showDrag ? 0 : -dragHandleWidth);
    const editButtonX = useSharedValue(0);
    const editModeOpacity = useSharedValue(showDrag ? 1 : 0);
    const titlePad = useSharedValue(0);

    // If the content of the list item touches the left edge of the list item then the edit button needs
    // some additional space to its right so its not touching the content. This offset provides the space
    // by making the edit button wider.
    const zeroEdgeOffset = zeroEdgeContent ? 15 : 0;

    const dragHandleAnimatedStyles = useAnimatedStyle(() => ({
      right: dragHandleX.value,
      opacity: editModeOpacity.value,
    }));

    const editButtonAnimatedStyles = useAnimatedStyle(() => ({
      opacity: editModeOpacity.value,
    }));

    const leftGroupAnimatedStyles = useAnimatedStyle(() => ({
      left: editButtonX.value,
      paddingRight: titlePad.value,
    }));

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
      resetEditor,
    }));

    const resetEditor = () => {
      swipeableRef.current?.close();
    };

    // Force a re-render when the icon changes.
    useEffect(() => {
      setRerender(!rerender);
    }, [editable?.item?.icon]);

    useEffect(() => {
      // If we're showng the drag handle regardless of editing then we need to ignore editor state changes.
      if (showDrag) return;

      // The delay allows the right image (e.g. caret) to fade out before edit mode animation begins.
      if (showEditor) {
        editButtonX.value = withDelay(
          100,
          withTiming(editButtonWidth - 15 + zeroEdgeOffset, { duration: 200 }),
        );
        editModeOpacity.value = withDelay(
          100,
          withTiming(1, { duration: 200 }),
        );

        if (editable?.reorder) {
          titlePad.value = withDelay(
            100,
            withTiming(15 * 2, { duration: 200, easing: Easing.linear }),
          );
        }

        if (drag) {
          dragHandleX.value = withDelay(100, withTiming(0, { duration: 200 }));
        }
      } else {
        editButtonX.value = withDelay(100, withTiming(0, { duration: 200 }));
        editModeOpacity.value = withDelay(
          100,
          withTiming(0, { duration: 200 }),
        );
        titlePad.value = withDelay(
          100,
          withTiming(0, { duration: 200, easing: Easing.linear }),
        );

        if (drag) {
          dragHandleX.value = withDelay(
            100,
            withTiming(-dragHandleWidth, { duration: 100 }),
          );
        }
      }
    }, [showEditor]);

    const renderDragHandle = () => {
      if (!editable?.reorder && !showDrag) return null;
      return (
        <Animated.View style={[s.dragTouchContainer, dragHandleAnimatedStyles]}>
          <Pressable onPressIn={drag} disabled={!showEditor && !showDrag}>
            <Icon
              name={'menu'}
              type={'ionicon'}
              size={22}
              color={theme.colors.midGray}
              style={s.dragIcon}
            />
          </Pressable>
        </Animated.View>
      );
    };

    const renderEditButton = () => {
      if (!editable?.item) return null;
      return (
        // Force edit button to be invisible when not shown (prevents any peek visibility of the
        // button if not completely out of view).
        // Must disable the button when now shown, some of the touch area is always in view.
        <Animated.View
          style={[
            s.editTouchContainer,
            { left: -editButtonWidth - zeroEdgeOffset },
            editButtonAnimatedStyles,
          ]}>
          <Pressable onPress={doEditAction} disabled={!showEditor}>
            <Icon
              name={editable.item.icon}
              type={'ionicon'}
              size={22}
              color={editable.item.color}
              style={s.editIcon}
            />
          </Pressable>
        </Animated.View>
      );
    };

    const doEditAction = () => {
      if (editable?.item?.action === 'open-swipeable') {
        swipeableRef?.current?.openRight();
      }
      editable?.onEditItem && editable?.onEditItem();
    };

    return (
      <AppleStyleSwipeableRow
        ref={swipeableRef}
        enabled={!showEditor}
        leftItems={swipeable?.leftItems}
        rightItems={swipeable?.rightItems}
        position={position}
        onSwipeableClose={onSwipeableClose}
        onSwipeableOpen={onSwipeableOpen}
        onSwipeableWillClose={onSwipeableWillClose}
        onSwipeableWillOpen={onSwipeableWillOpen}>
        {!position?.includes('last') ? (
          <View
            style={[
              s.bottomDivider,
              {
                borderColor: bottomDividerColor,
                left: bottomDividerLeft,
                right: bottomDividerRight,
              },
            ]}
          />
        ) : null}
        <RNEListItem
          containerStyle={[
            theme.styles.listItemContainer,
            !rightImage ? { paddingRight: 0 } : {},
            containerStyle,
          ]}
          disabled={disabled || showEditor}
          disabledStyle={disabledStyle}
          delayLongPress={delayLongPress}
          onLongPress={onLongPress}
          onPress={onPress}>
          <Animated.View
            style={[s.leftGroup, leftContainerStyle, leftGroupAnimatedStyles]}>
            {renderEditButton()}
            {extraContentComponent}
            <View style={s.leftImageContainer}>
              {React.isValidElement(leftImage) ? (
                <RNEListItem.Content style={s.leftImageContent}>
                  {leftImage}
                </RNEListItem.Content>
              ) : typeof leftImage === 'string' ? (
                <Icon
                  name={leftImage}
                  type={leftImageType}
                  color={leftImageColor || theme.colors.icon}
                  size={leftImageSize}
                />
              ) : leftImage !== undefined ? (
                <Avatar
                  source={leftImage as ImageSourcePropType}
                  imageProps={{ resizeMode: 'contain' }}
                />
              ) : null}
            </View>
            <RNEListItem.Content
              style={[
                leftImage ? s.wLeftImage : {},
                alignContent === 'top' ? s.alignTop : {},
              ]}>
              <RNEListItem.Title
                style={[theme.styles.listItemTitle, titleStyle]}
                numberOfLines={titleNumberOfLines}>
                {title}
              </RNEListItem.Title>
              {subtitle !== undefined && (
                <RNEListItem.Subtitle
                  style={[theme.styles.listItemSubtitle, subtitleStyle]}
                  numberOfLines={subtitleNumberOfLines}>
                  {subtitle}
                </RNEListItem.Subtitle>
              )}
            </RNEListItem.Content>
          </Animated.View>
          {value !== undefined && (
            <RNEListItem.Content
              right
              style={[
                s.valueContent,
                rightImage ? s.wRightImage : {},
                alignContent === 'top' ? s.alignTopValue : {},
              ]}>
              {React.isValidElement(value) ? (
                value
              ) : (
                <Text style={[theme.styles.listItemValue, valueStyle]}>
                  {value || placeholder}
                </Text>
              )}
            </RNEListItem.Content>
          )}
          {badgeValue !== undefined && (
            <Badge
              value={badgeValue}
              containerStyle={s.badgeContainer}
              textStyle={s.badgeText}
              badgeStyle={[
                s.badge,
                { backgroundColor: theme.colors?.[badgeStatus] },
              ]}
            />
          )}
          {!showEditor && !showDrag ? (
            <Animated.View
              entering={editable && FadeIn.delay(150)}
              exiting={editable && FadeOut}>
              {React.isValidElement(rightImage) ? (
                <RNEListItem.Content
                  right
                  style={[s.rightImageContent, s.rightImage]}>
                  {rightImage}
                </RNEListItem.Content>
              ) : typeof rightImage === 'string' ? (
                <RNEListItem.Content
                  right
                  style={[
                    alignContent === 'top' ? s.alignTop : {},
                    s.rightImage,
                  ]}>
                  <Icon
                    name={rightImage}
                    type={rightImageType}
                    color={rightImageColor || theme.colors.icon}
                    size={rightImageSize}
                  />
                </RNEListItem.Content>
              ) : rightImage ? (
                <RNEListItem.Chevron
                  iconProps={theme.styles.listItemIconProps}
                  containerStyle={[
                    alignContent === 'top' ? s.alignTop : {},
                    s.rightImage,
                  ]}
                />
              ) : null}
            </Animated.View>
          ) : (
            // When in edit mode the right image is not shown so we need to reserve the horizontal
            // space so the title and subtitle don't expand their size (due to flex: 1).
            <View style={s.rightImageSpacer}></View>
          )}
        </RNEListItem>
        {drag && renderDragHandle()}
      </AppleStyleSwipeableRow>
    );
  },
);

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  alignTop: {
    alignSelf: 'flex-start',
  },
  alignTopValue: {
    top: 16, // Value position is absolute, need to offset down to account for padding
  },
  first: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  last: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  badgeContainer: {
    right: -8,
  },
  badgeText: {
    ...theme.styles.textTiny,
    ...theme.styles.textBold,
    color: theme.colors.stickyWhite,
    ...Platform.select({
      android: {
        top: -1,
      },
    }),
  },
  badge: {
    borderWidth: 0,
  },
  bottomDivider: {
    borderWidth: StyleSheet.hairlineWidth,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  rightImage: {
    flex: 1,
    justifyContent: 'center',
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
  },
  leftImageContainer: {
    justifyContent: 'center',
  },
  leftImageContent: {
    maxWidth: 25,
  },
  rightImageContent: {
    maxWidth: 25,
  },
  rightImageSpacer: {
    width: theme.styles.listItemIconProps.size,
  },
  valueContent: {
    position: 'absolute',
    right: 15,
  },
  wLeftImage: {
    left: 8,
  },
  wRightImage: {
    right: 40,
  },
  dragIcon: {
    justifyContent: 'center',
    height: '100%',
  },
  dragTouchContainer: {
    width: dragHandleWidth,
    height: '100%',
    position: 'absolute',
    right: -dragHandleWidth, // move out of view
  },
  editIcon: {
    justifyContent: 'center',
    height: '100%',
  },
  editTouchContainer: {
    width: editButtonWidth,
    height: '100%',
    position: 'absolute',
    left: -editButtonWidth, // move out of view
  },
}));

export { ListItem };
