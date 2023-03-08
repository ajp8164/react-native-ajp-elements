import { AppTheme, useTheme } from './theme';
import { Text, TextStyle, View } from 'react-native';

import React from 'react';
import { makeStyles } from '@rneui/themed';

interface BulletList {
  type?: string;
  bullet?: string;
  initialCount?: number;
  items: string[] | JSX.Element[];
  containerStyle?: object;
  itemStyle?: TextStyle[] | TextStyle;
  bulletStyle?: TextStyle[] | TextStyle;
}

const BulletList = ({
  type = 'unordered',
  bullet = '\u2022',
  initialCount = 0,
  items,
  containerStyle,
  itemStyle,
  bulletStyle,
}: BulletList) => {
  const theme = useTheme();
  const s = useStyles(theme);

  let count = initialCount;

  return (
    <View style={containerStyle}>
      {items.map(i => {
        count++;
        return (
          <View style={[s.row]} key={count}>
            <Text style={[s.bulletStyle, bulletStyle]}>
              {type === 'unordered' ? bullet : count + '.'}
            </Text>
            {typeof i === 'object' ? (
              i
            ) : (
              <Text style={[s.itemStyle, itemStyle]}>{i}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  bulletStyle: {
    marginRight: 5,
  },
  itemStyle: {
    flex: 1,
  },
}));

export { BulletList };
