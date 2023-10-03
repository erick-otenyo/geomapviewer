import request,{ apiRequest } from "@/utils/request";

export const fetchTimestamps = (dataPath) => {
  const url = `${dataPath}?timestamps`;
  return gskyTimestampsRequest.get(url);
};

export const fetchRasterTimestamps = (tileJsonUrl) => {
  return request(tileJsonUrl)
    .then((res) => res.data.timestamps)
};
