import request, { apiRequest } from "@/utils/request";

export const fetchTimestamps = (dataPath) => {
  const url = `${dataPath}?timestamps`;
  return gskyTimestampsRequest.get(url);
};

export const fetchUrlTimestamps = (tileJsonUrl, timestampsKey) => {
  return request(tileJsonUrl).then((res) => {
    if (timestampsKey) {
      return res.data[timestampsKey];
    }

    return res.data;
  });
};
