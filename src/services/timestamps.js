import request, { apiRequest } from "@/utils/request";

export const fetchTimestamps = (dataPath) => {
  const url = `${dataPath}?timestamps`;
  return gskyTimestampsRequest.get(url);
};

export const fetchRasterTimestamps = (
  tileJsonUrl,
  timestampsKey = "timestamps"
) => {
  return request(tileJsonUrl).then((res) => res.data[timestampsKey]);
};
