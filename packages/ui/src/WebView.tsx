import {
  type ColorValue,
  Linking,
  Platform,
  type ViewStyle,
} from 'react-native';
import {
  WebView as RNWebView,
  type WebViewMessageEvent,
  type WebViewNavigation,
  type WebViewProps,
} from 'react-native-webview';
import React, { useRef, useState } from 'react';
import { fontSizes, useTheme } from './theme';

import type { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

type FontFormats = 'ttf' | 'otf';

export const generateAssetsFontCss = (
  fontFileName: string,
  fileFormat: FontFormats = 'otf',
) => {
  const fileUri = Platform.select({
    ios: `${fontFileName}.${fileFormat}`,
    android: `file:///android_asset/fonts/${fontFileName}.${fileFormat}`,
  });

  // prettier- ignore
  return `@font-face {
    font-family: '${fontFileName}';
    src: local('${fontFileName}'),
    url('${fileUri}')
    format('${fileFormat === 'ttf' ? 'truetype' : 'opentype'}');
  }`;
};

interface WebViewInterface extends WebViewProps {
  backgroundColor?: ColorValue;
  bodyHtml?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  fontSize?: number;
  originWhitelist?: string[];
  source?: WebViewSource;
}

const WebView = ({
  backgroundColor,
  bodyHtml = '',
  containerStyle,
  fontSize = fontSizes.normal,
  originWhitelist = ['*'],
  source,
  ...otherProps
}: WebViewInterface) => {
  const theme = useTheme();

  const webViewRef = useRef<RNWebView>(null);
  const [webViewHeight, setWebViewHeight] = useState(0);

  backgroundColor = backgroundColor || theme.colors.viewBackground;

  const HEAD = `
    <head>
    <style type="text/css">
      ${generateAssetsFontCss('SFUIText-Regular')}
    </style>
    </head>
  `;

  source = source || {
    baseUrl: '',
    html: `
      <meta http-equiv="content-type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <html>
        ${HEAD}
        <body style="background-color:${backgroundColor as string};">
          <div style="color:${
            theme.colors.text
          };font-family:SFUIText-Regular,Arial,sans-serif;font-size:${fontSize}px;">
            ${bodyHtml}
          </div>
        </body>
      </html>
    `,
  };

  const injectScript = `
    (function () {
      window.ReactNativeWebView.postMessage(document.body.scrollHeight)
    }());
  `;

  const onWebViewMessage = (event: WebViewMessageEvent) => {
    setWebViewHeight(Number(event.nativeEvent.data) + 80);
  };

  return (
    <RNWebView
      ref={webViewRef}
      originWhitelist={originWhitelist}
      source={source}
      injectedJavaScript={injectScript}
      onMessage={onWebViewMessage}
      onNavigationStateChange={(event: WebViewNavigation) => {
        if (event.url !== 'about:blank' && !event.url.includes('file://')) {
          webViewRef.current?.stopLoading();
          Linking.openURL(event.url);
        }
      }}
      style={{
        height: webViewHeight,
        ...containerStyle,
      }}
      {...otherProps}
    />
  );
};

export { WebView };
