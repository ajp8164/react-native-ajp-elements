import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { Key, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { fontFamily, useTheme, viewport } from './theme';

import { Picker as RNPicker } from '@react-native-picker/picker';
import { isEqual } from 'lodash';
import { makeStyles } from '@rn-vui/themed';

type PickerInternalValue = string | Date;
type PickerInternalOnChangeValue = {
  wheelIndex: number;
  value: PickerInternalValue;
  index: number;
};

// export type PickerItem = OptionType;

export type PickerItem = {
  label: string;
  value: string;
  color?: string;
};

export type PickerWidth = string | number;

export interface PickerInterface {
  useDatePicker?: boolean;
  items?: PickerItem[] | PickerItem[][];
  itemWidth?: PickerWidth | PickerWidth[];
  labels?: string | string[];
  labelWidth?: PickerWidth | PickerWidth[];
  placeholder?: string | PickerItem | PickerItem[];
  value?: Date | string | string[];
  onValueChange: (
    wheelIndex: number,
    value: Date | string | string[],
    index: number,
  ) => void;
}

const defaultPlaceholder: PickerItem = {
  label: 'Select an item...',
  value: 'placeholder',
  color: '#9EA0A4',
};

const Picker = ({
  useDatePicker = false,
  items,
  itemWidth,
  labels,
  labelWidth,
  placeholder = defaultPlaceholder,
  value,
  onValueChange,
}: PickerInterface) => {
  const theme = useTheme();
  const s = useStyles();

  const multiWheel = Array.isArray(items && items[0]);

  const [pickerItems, setPickerItems] = useState<PickerItem[][]>(
    (Array.isArray(items && items[0]) ? items : [items]) as PickerItem[][],
  );
  const [pickerValue, setPickerValue] = useState<PickerInternalValue[]>(
    (Array.isArray(value) ? value : [value]) as PickerInternalValue[],
  );
  const [pickerItemWidth, _setPickerItemWidth] = useState<PickerWidth[]>(
    (itemWidth && Array.isArray(itemWidth)
      ? itemWidth
      : [itemWidth]) as PickerWidth[],
  );
  const [pickerLabels, _setPickerLabels] = useState<string[]>(
    (labels && Array.isArray(labels) ? labels : [labels]) as string[],
  );
  const [pickerLabelWidth, _setPickerLabelWidth] = useState<PickerWidth[]>(
    (labelWidth && Array.isArray(labelWidth)
      ? labelWidth
      : [labelWidth]) as PickerWidth[],
  );

  // const getSelectedItem = useCallback(
  //   (
  //     items: PickerItem[][],
  //     value: string[],
  //   ): { item: PickerItem[]; index: number[] } => {
  //     const isDate = (obj: unknown): boolean => {
  //       return Object.prototype.toString.call(obj) === '[object Date]';
  //     };

  //     if (!isDate(value)) {
  //       // One selectedItem/idx entry per wheel.
  //       // selectedItem is an array of picker items; [{label:la,value:va},{label:lb,value:vb}...]
  //       // idx is an array of item indices corresponding 1:1 with selectedItems. selectedItem[0] has an
  //       // index of idx[0], selectedItem[1] of idx[1], etc.
  //       const si: PickerItem[] = [];
  //       const idx: number[] = [];
  //       for (let wheelIndex = 0; wheelIndex < items.length; wheelIndex++) {
  //         let itemIndex = (items[wheelIndex] as PickerItem[]).findIndex(
  //           (pItem: PickerItem) => {
  //             return isEqual(pItem.value, value[wheelIndex]);
  //           },
  //         );
  //         itemIndex = itemIndex === -1 ? 0 : itemIndex;
  //         si.push(items[wheelIndex][itemIndex] || {});
  //         idx.push(itemIndex);
  //       }
  //       return {
  //         index: idx,
  //         item: si,
  //       };
  //     } else {
  //       return {
  //         index: [0],
  //         item: [
  //           {
  //             label: '',
  //             value: value[0],
  //             color: '',
  //           },
  //         ],
  //       };
  //     }
  //   },
  //   [],
  // );

  useEffect(() => {
    const handlePlaceholder = () => {
      const pi = ([] as PickerItem[][]).concat(pickerItems);
      if (placeholder !== 'none') {
        let phValue = placeholder;
        if (typeof placeholder === 'string') {
          phValue = { ...defaultPlaceholder, label: placeholder };
        }
        const ph = (
          Array.isArray(phValue) ? phValue : [phValue]
        ) as PickerItem[];

        pi.forEach((i, idx) => {
          if (!isEqual(ph[idx], {}) && i[0].value !== 'placeholder') {
            i.splice(0, 0, ph[idx] || ph[0]);
          }
        });
      }
      return pi;
    };

    if (!useDatePicker) {
      const pi = handlePlaceholder();
      setPickerItems(pi);
    }
  }, []);

  const renderPickerItems = (items: PickerItem[]) => {
    return items.map(item => {
      return (
        <RNPicker.Item
          label={item.label}
          value={item.value}
          key={item.value as Key}
          color={item.color || theme.colors.text}
          fontFamily={fontFamily}
        />
      );
    });
  };

  const onDateValueChange = (_event: DateTimePickerEvent, date?: Date) => {
    const now = Date();
    setPickerValue([date || now]);
    onValueChange(0, date || now, 0);
  };

  const onChange = ({
    wheelIndex,
    value,
    index,
  }: PickerInternalOnChangeValue) => {
    const pv = ([] as string[]).concat(pickerValue as string[]);
    pv[wheelIndex] = (value === 'placeholder' ? '' : value) as string;
    // The internal pickerValue is always an array, even if only one wheel.
    // The value sent to the caller is a plain value if one wheel an array otherwise.
    setPickerValue(pv);
    onValueChange(wheelIndex, multiWheel ? pv : pv[0], index);
  };

  return (
    <View>
      {useDatePicker ? (
        <DateTimePicker
          display="spinner"
          onChange={onDateValueChange}
          value={pickerValue[0] as Date}
        />
      ) : (
        <View style={s.pickerContainer}>
          {pickerItems.map((wheel, wheelIndex) => {
            let iWidth: string | number =
              (itemWidth && pickerItemWidth[wheelIndex]) || '100%';
            if (typeof iWidth === 'string') {
              iWidth = (parseFloat(iWidth) / 100) * viewport.width;
            }
            let lWidth = pickerLabelWidth[wheelIndex] || 0;
            if (typeof lWidth === 'string') {
              lWidth = parseFloat(lWidth) / 100;
            }
            const tWidth = iWidth + lWidth;
            return (
              <View
                key={wheelIndex}
                style={[s.wheelContainer, { width: tWidth }]}>
                {pickerLabels ? (
                  <View style={[s.labelContainer, { width: lWidth }]}>
                    <Text style={s.label}>{pickerLabels[wheelIndex]}</Text>
                  </View>
                ) : null}
                <View style={{ width: iWidth }}>
                  <RNPicker
                    onValueChange={(value, index) =>
                      onChange({ wheelIndex, value, index })
                    }
                    selectedValue={pickerValue[wheelIndex]}>
                    {renderPickerItems(wheel)}
                  </RNPicker>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  wheelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  labelContainer: {
    justifyContent: 'center',
    marginTop: -1,
  },
  label: {
    fontSize: 22,
    fontFamily: fontFamily,
    textAlign: 'right',
    color: theme.colors.text,
  },
}));

export { Picker };
