import request, { apiRequest } from "@/utils/request";

export const fetchTimestamps = (dataPath) => {
  const url = `${dataPath}?timestamps`;
  return gskyTimestampsRequest.get(url);
};

export const fetchUrlTimestamps = (tileJsonUrl, timestampsKey) => {
  return request(tileJsonUrl).then((res) => {
    if (timestampsKey) {
      const timestamps = res.data[timestampsKey];

      //sort by date
      timestamps.sort((a, b) => {
        return new Date(a) - new Date(b);
      });

      return timestamps;
    }

    return res.data;
  });
};
