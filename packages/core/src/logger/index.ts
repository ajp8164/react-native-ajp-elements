import { content, header, sessionTransport, toString } from './sessionLog';
import { init as initSentry, sentryTransport } from './sentryLog';

import { logger } from 'react-native-logs';

export type SentryTransportOptions = {
  msg?: string;
  level?: {
    severity: number;
    text: string;
  };
};

const init = (userId?: string) => {
  initSentry(userId);
};

const _log = logger.createLogger({
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
    sessonDebug: 5,
    sessionInfo: 6,
    sessionWarn: 7,
    sessionError: 8,
    sessionFatal: 9,
  },
  printDate: false,
  printLevel: false,
  transport: [sentryTransport, sessionTransport],
});

_log.sessionInfo(header);

// Typescript won't allow the exporting of a class that contains private or protected functions.
// "Property of exported class expression may not be private or protected.ts(4094)"
// This log object provides some indirection to be able to export necessary functions.
const log = {
  debug: _log.debug,
  info: _log.info,
  warn: _log.warn,
  error: _log.error,
  fatal: _log.fatal,
  sessonDebug: _log.debug,
  sessionInfo: _log.info,
  sessionWarn: _log.warn,
  sessionError: _log.error,
  sessionFatal: _log.fatal,
};

export { init, log, toString as logToString, content as logContent };
