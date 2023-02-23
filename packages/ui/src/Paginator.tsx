import { View, ViewStyle } from 'react-native';

import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import React from 'react';
import { useTheme } from './theme';

interface PaginatorInterface {
  active: number;
  containerStyle?: ViewStyle | ViewStyle[];
  length: number;
}

const Paginator = ({ active, containerStyle, length }: PaginatorInterface) => {
  const theme = useTheme();

  return (
    <View style={containerStyle}>
      <AnimatedDotsCarousel
        length={length}
        currentIndex={active}
        maxIndicators={1}
        interpolateOpacityAndColor={true}
        activeIndicatorConfig={{
          color: theme.colors.darkGray,
          margin: 3,
          opacity: 1,
          size: 10,
        }}
        // This not referenced since maxIndicators=1 (prop required).
        inactiveIndicatorConfig={{
          color: theme.colors.lightGray,
          margin: 3,
          opacity: 1,
          size: 10,
        }}
        decreasingDots={[
          {
            config: {
              color: theme.colors.lightGray,
              margin: 3,
              opacity: 1,
              size: 8,
            },
            quantity: 2,
          },
          {
            config: {
              color: theme.colors.lightGray,
              margin: 3,
              opacity: 0.7,
              size: 6,
            },
            quantity: 1,
          },
          {
            config: {
              color: theme.colors.lightGray,
              margin: 3,
              opacity: 0.5,
              size: 4,
            },
            quantity: length,
          },
        ]}
      />
    </View>
  );
};

export { Paginator };
