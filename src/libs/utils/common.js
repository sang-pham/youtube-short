import { baseURL } from "../config"

export const getAvatarUrl = (id) => {
  return `${baseURL}/user/${id}/avatar`;
}

export const getFullName = (user) => `${user.first_name} ${user.last_name}`

export const swapItemArray = (array, fromIdx, toIdx) => {
  const item = array[fromIdx];
  if (!item) return;

  array.splice(fromIdx, 1);
  array.splice(toIdx, 0, item);
}
