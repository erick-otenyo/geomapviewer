import { gskyTimestampsRequest, synopTimestampsRequest } from "@/utils/request";

export const fetchTimestamps = (dataPath) => {
  const url = `${dataPath}?timestamps`;
  return gskyTimestampsRequest.get(url);
};

export const fetchSynopTimestamps = (dataPath) => {
  const url = `${dataPath}`;
  return synopTimestampsRequest.get(url);
};
