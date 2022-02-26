import { baseURL } from "../config"
import { format, isSameDay, isSameWeek, isThisWeek, } from "date-fns";

export const getAvatarUrl = (id) => {
  return `${baseURL}/user/${id}/avatar`;
}

export const getFullName = (user) => `${user.first_name} ${user.last_name}`


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