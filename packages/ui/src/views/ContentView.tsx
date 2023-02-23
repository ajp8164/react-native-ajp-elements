import { Linking, Text, TextStyle, View, ViewStyle } from 'react-native';

import { BulletList } from '../BulletList';
import type { ContentItem } from '@react-native-ajp-elements/common';
import React from 'react';
import { useTheme } from '../theme';

interface CachedImage {
  containerStyle?: ViewStyle | ViewStyle[];
  items: ContentItem[];
  titleStyle?: TextStyle | TextStyle[];
  textStyle?: TextStyle | TextStyle[];
}

const ContentView = ({
  containerStyle,
  items,
  titleStyle,
  textStyle,
}: CachedImage) => {
  const theme = useTheme();

  const openURL = (link: string) => {
    const re = /^(http|https|tel|telprompt):\/\//;
    if (!link.trim().match(re)) {
      link = 'http://' + link;
    }
    Linking.openURL(link);
  };

  return (
    <>
      {items.map((i, index) => {
        return (
          <View style={[{ marginTop: 20 }, containerStyle]} key={index}>
            {i.title ? (
              <Text
                style={[
                  theme.styles.textHeading5,
                  { marginBottom: 15, color: theme.colors.brandPrimary },
                  titleStyle,
                ]}>
                {i.title}
              </Text>
            ) : null}
            {i.text ? (
              <Text style={[theme.styles.textNormal, textStyle]}>{i.text}</Text>
            ) : null}
            {i.orderedBullets ? (
              <BulletList
                containerStyle={{ marginTop: 10 }}
                bulletStyle={[
                  theme.styles.textNormal,
                  { color: theme.colors.lightGray },
                ]}
                itemStyle={theme.styles.textNormal}
                type={'ordered'}
                items={i.orderedBullets.map(b => {
                  return b;
                })}
              />
            ) : null}
            {i.unorderedBullets ? (
              <BulletList
                containerStyle={{ marginTop: 10 }}
                bulletStyle={[
                  theme.styles.textNormal,
                  { color: theme.colors.lightGray },
                ]}
                itemStyle={theme.styles.textNormal}
                type={'unordered'}
                items={i.unorderedBullets.map(b => {
                  return b;
                })}
              />
            ) : null}
            {i.link ? (
              <View
                style={[
                  {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    height: 200,
                  },
                ]}>
                <Text style={theme.styles.textNormal}>
                  {i.link.prefix}
                  <Text
                    style={[theme.styles.textNormal, theme.styles.link]}
                    onPress={() => {
                      openURL(i.link?.url || '');
                    }}>
                    {i.link.text}
                  </Text>
                  {i.link.suffix ? (
                    <Text style={theme.styles.textNormal}>{i.link.suffix}</Text>
                  ) : null}
                </Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </>
  );
};

export { ContentView };
