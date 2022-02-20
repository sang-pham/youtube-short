import { baseURL } from "../config"

export const getAvatarUrl = (id) => {
  return `${baseURL}/user/${id}/avatar`;
}

export const getFullName = (user) => `${user.first_name} ${user.last_name}`