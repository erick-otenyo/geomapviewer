import request from "@/utils/request";

import { CMS_API } from "@/utils/apis";

export const fetchRasterPixelValue = ({ layerId, lat, lng, time }) => {
  const params = {
    time: time,
    x: lng,
    y: lat,
  };

  return request
    .get(`${CMS_API}/raster-data/pixel/${layerId}`, { params })
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
    geostore_id: geostoreId,
    value_type: valueType,
  };

  return request
    .get(`${CMS_API}/raster-data/geostore/${layerId}`, { params })
    .then((res) => res?.data);
};

export const fetchRasterPixelTimeseriesValue = ({
  layerId,
  lat,
  lng,
  startTime,
}) => {
  const params = {
    x: lng,
    y: lat,
    time_from: startTime,
  };

  return request
    .get(`${CMS_API}/raster-data/pixel/timeseries/${layerId}`, { params })
    .then((res) => res?.data);
};

export const fetchRasterGeostoreTimeseriesValue = ({
  layerId,
  geostoreId,
  startTime,
  valueType,
}) => {
  const params = {
    geostore_id: geostoreId,
    time_from: startTime,
    value_type: valueType,
  };

  return request
    .get(`${CMS_API}/raster-data/geostore/timeseries/${layerId}`, { params })
    .then((res) => res?.data);
};
