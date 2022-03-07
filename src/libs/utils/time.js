import { format, isSameDay, isSameWeek, formatDistance, } from "date-fns";

const timeDiff = mysqlTime => {

  return formatDistance(new Date(mysqlTime), new Date(), { addSuffix: true });
};

const formatMessageTime = mysqlTime => {
  let now = new Date();
  let time = new Date(mysqlTime);

  if (isSameDay(time, now)) {
    return format(time, "hh:mm aa");
  }

  if (isSameWeek(time, now, { weekStartsOn: 1 })) {
    return format(time, "dd/MM");
  }

  return format(time, "dd/MM/yyyy");
}

const shortTimeDiff = mysqlTime => {
  let _time = new Date(mysqlTime).getTime();
  let second = Math.round((Date.now() - _time) / 1000);
  let time = 0;
  // if (second < 60) {
  //   return "Just now";
  // }
  if (second < 3600) {
    time = Math.round(second / 60);
    return time + 'm';
  }
  if (second < 86400) {
    time = Math.round(second / 3600);
    return time + 'h';
  }
  if (second < 2629800) {
    time = Math.round(second / 86400);
    return time + 'd';
  }
  if (second < 31557600) {
    time = Math.round(second / 2629800);
    return time + 'mth';
  }
  time = Math.round(second / 31557600);
  return time + 'y';
};

export { timeDiff, shortTimeDiff, formatMessageTime };
