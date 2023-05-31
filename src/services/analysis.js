import request from "@/utils/request";

import { CMS_API } from "@/utils/apis";

export const fetchRasterPixelValue = ({ layerId, lat, lng, time }) => {
  const params = {
    time: time,
    layer: layerId,
    x: lng,
    y: lat,
  };

  return request
    .get(`${CMS_API}/raster-data/pixel`, { params })
    .then((res) => res?.data.value);
};

export const fetchRasterGeostoreValue = ({
  layerId,
  geostoreId,
  time,
  valueType,
}) => {
  const params = {
    time: time,
    layer: layerId,
    geostore_id: geostoreId,
    value_type: valueType,
  };

  return request
    .get(`${CMS_API}/raster-data/geostore`, { params })
    .then((res) => res?.data);
};
