import { getBuildNumber, getVersion } from 'react-native-device-info';

import { DateTime } from 'luxon';
import type { LogEntry } from '@react-native-ajp-elements/common';
import { Platform } from 'react-native';
import type { transportFunctionType } from 'react-native-logs';
import type { SentryTransportOptions } from '.';

const MAX_ENTRIES = 1000;
const sessionLogContent: LogEntry[] = [];

const version = `${getVersion()} (${getBuildNumber()})`;
const device = Platform.OS === 'ios' ? 'iOS' : 'Android';
const header = `\n${device} Version ${version}\n${DateTime.now().toFormat(
  'D, t ZZZZ',
)}\n\n`;

const sessionTransport: transportFunctionType<SentryTransportOptions> = ({
  msg,
  level,
}) => {
  if (sessionLogContent.length > MAX_ENTRIES) {
    sessionLogContent.shift();
  }
  const ts = DateTime.now().toFormat("yyyy-MM-dd'T'TT.SSS");
  sessionLogContent.push({ msg, level, ts });
};

const toString = () => {
  let str = '';
  sessionLogContent.forEach(entry => {
    str += entry.level ? `[${entry.level.text}] ` : '';
    str += `${entry.msg}\n`;
  });

  return str;
};

export { sessionTransport, sessionLogContent as content, toString, header };
