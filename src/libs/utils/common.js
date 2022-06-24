import {baseURL} from '../config';

export const getAvatarUrl = id => {
  return `${baseURL}/user/${id}/avatar?${new Date()}`;
};

export const swapItemArray = (array, fromIdx, toIdx) => {
  const item = array[fromIdx];
  if (!item) return;

  array.splice(fromIdx, 1);
  array.splice(toIdx, 0, item);
};

export const parseImageToBlob = async path => {
  const res = await fetch(path);
  const blob = await res.blob();
  return blob;
};
