import request from "@/utils/request";

export const getWMSFeatureInfoUrl = (lng, lat, url, params = {}) => {
  //Implementation borrowed from https://gis.stackexchange.com/a/307730

  // convert lng lat to Web Mercator
  const r = 6378137 * Math.PI * 2;
  const x = (lng / 360) * r;
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = ((0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI) * r;

  // create small bbox from x y
  const bbox = x - 50 + "," + (y - 50) + "," + (x + 50) + "," + (y + 50);

  // common params
  const baseParams = {
    SERVICE: "WMS",
    VERSION: "1.3.0",
    REQUEST: "GetFeatureInfo",
    FORMAT: "image/png",
    TRANSPARENT: true,
    WIDTH: 256,
    HEIGHT: 256,
    CRS: "EPSG:3857",
    STYLES: "",
    INFO_FORMAT: "application/json",
    ...params,
    BBOX: bbox,
    I: 128,
    J: 128,
  };

  // convert params object to query string equivalent
  const qs = Object.keys(baseParams)
    .map((key) => `${key}=${baseParams[key]}`)
    .join("&");

  return `${url}?${qs}`;
};

export const getFeatureInfo = (url) => {
  return request
    .get(url)
    .then(
      (response) =>
        response.data.features &&
        !!response.data.features.length &&
        response.data.features[0]
    )
    .catch((err) => {});
};
