import { api } from "~/api";

export const getImageAsync = async (url: string) => {
  const { data } = await api.get(url, { responseType: "arraybuffer" });

  return data;
};
