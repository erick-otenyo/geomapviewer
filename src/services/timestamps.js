import { gskyTimestampsRequest } from "@/utils/request";

export const fetchTimestamps = (dataPath) => {
  const url = `${dataPath}?timestamps`;
  return gskyTimestampsRequest.get(url);
};
