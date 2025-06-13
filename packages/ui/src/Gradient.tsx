import { DimensionValue, StyleSheet, View, ViewProps } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import React from 'react';

type GradientProps = {
  fromColor: string;
  fromStop?: string;
  toColor: string;
  toStop?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
  height?: DimensionValue | undefined;
  opacityColor1?: number;
  opacityColor2?: number;
} & ViewProps;

function Gradient({
  children,
  fromColor,
  fromStop = '0',
  toColor,
  toStop = '1',
  height = '100%',
  opacityColor1 = 1,
  opacityColor2 = 1,
  ...otherViewProps
}: GradientProps) {
  const gradientUniqueId = `grad${fromColor}+${toColor}`.replace(
    /[^a-zA-Z0-9 ]/g,
    '',
  );
  return (
    <>
      <View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            height,
            zIndex: -1,
            top: 0,
            left: 0,
          },
          otherViewProps.style,
        ]}
        {...otherViewProps}>
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient
              id={gradientUniqueId}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%">
              <Stop
                offset={fromStop}
                stopColor={fromColor}
                stopOpacity={opacityColor1}
              />
              <Stop
                offset={toStop}
                stopColor={toColor}
                stopOpacity={opacityColor2}
              />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#${gradientUniqueId})`} />
        </Svg>
      </View>
      {children}
    </>
  );
}

export { Gradient };
