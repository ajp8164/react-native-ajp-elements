import { Linking } from 'react-native';

/**
 * Open a url  using the device handler; e.g. default web browser.
 * @param url - the url, if not protocol is present use 'https://'
 */
const openURL = (url: string) => {
  const re = /^(http|https|tel|telprompt):\/\//;
  if (!url.trim().match(re)) {
    url = 'https://' + url;
  }
  Linking.openURL(url);
};

export { openURL };
