import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

export const _timeAgo = new TimeAgo("en-US");
const _7_DAYS = 7 * 24 * 60 * 60 * 1000;
export default function formatDate(date: Date): string;
export default function formatDate(timeStamp: number): string;
export default function formatDate(date: Date | number) {
  if (typeof date == "number") date = new Date(date);
  return Date.now() - date.getTime() > _7_DAYS
    ? date.toLocaleString()
    : _timeAgo.format(date, "round-minute");
}
