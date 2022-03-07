import { format, isSameDay, isSameWeek, formatDistance, } from "date-fns";

const timeDiff = mysqlTime => {

  return formatDistance(new Date(mysqlTime), new Date(), { addSuffix: true });

  // let _time = new Date(mysqlTime).getTime();
  // let second = Math.round((Date.now() - _time) / 1000);
  // let time = 0;
  // // if (second < 60) {
  // //   return "Just now";
  // // }
  // if (second < 3600) {
  //   time = Math.round(second / 60);
  //   if (time <= 1) {
  //     return 'A minute ago';
  //   }
  //   return time + ' minutes ago';
  // }
  // if (second < 86400) {
  //   time = Math.round(second / 3600);
  //   if (time == 1) {
  //     return 'An hour ago';
  //   }
  //   return time + ' hours ago';
  // }
  // if (second < 2629800) {
  //   time = Math.round(second / 86400);
  //   if (time == 1) {
  //     return 'A day ago';
  //   }
  //   return time + ' days ago';
  // }
  // if (second < 31557600) {
  //   time = Math.round(second / 2629800);
  //   if (time == 1) {
  //     return 'A month ago';
  //   }
  //   return time + ' months ago';
  // }
  // time = Math.round(second / 31557600);
  // if (time == 1) {
  //   return 'A year ago';
  // }
  // return time + ' years ago';
};

export const formatMessageTime = mysqlTime => {
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

export { timeDiff };
