import { apiRequest } from "@/utils/request";

export const fetchTimestamps = (dataPath) => {
  const url = `${dataPath}?timestamps`;
  return gskyTimestampsRequest.get(url);
};

export const fetchRasterTimestamps = (layerId) => {
  const url = "/file-raster";

  const params = {
    layer: layerId,
  };

  return apiRequest(url, { params })
    .then((res) => res.data)
    .then((res) => res.map((r) => r.time));
};
