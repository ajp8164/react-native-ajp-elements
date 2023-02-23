export type LogEntry = {
  msg: string;
  level: { severity: number; text: string };
  ts: string;
};
