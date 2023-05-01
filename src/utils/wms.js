import { get } from "axios";
import WMSCapabilities from "wms-capabilities";
import { subMonths, subDays } from "date-fns";

import request from "@/utils/request";

function parseISO8601Duration(durationString) {
  const regex =
    /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+(?:\.[0-9]+)?)S)?)?/;
  const matches = regex.exec(durationString);

  const years = matches[1] || 0;
  const months = matches[2] || 0;
  const days = matches[3] || 0;
  const hours = matches[4] || 0;
  const minutes = matches[5] || 0;
  const seconds = parseFloat(matches[6]) || 0;

  const duration =
    (((years * 365 + months * 30 + days) * 24 + hours) * 60 + minutes) * 60 +
    seconds;
  return duration * 1000; // convert to milliseconds
}

function getValidTimestamps(rangeString) {
  const parts = rangeString.split("/");
  const start_time = new Date(parts[0]);
  const end_time = new Date(parts[1]);
  const duration = parseISO8601Duration(parts[2]);

  let current_time = start_time.getTime();
  const valid_timestamps = [];

  while (current_time < end_time.getTime()) {
    valid_timestamps.push(new Date(current_time).toISOString());
    current_time += duration;
  }

  return valid_timestamps;
}

export const getTimeValuesFromWMS = async (wmsUrl, layerName, params = {}) => {
  const defaultParams = {
    service: "WMS",
    request: "GetCapabilities",
    version: "1.3.0",
  };

  try {
    // Fetch the GetCapabilities document from the WMS server
    const response = await get(wmsUrl, {
      params: { ...defaultParams, ...params },
    });

    // parse xml
    const capabilities = new WMSCapabilities(response.data).toJSON();

    // get all layers
    const layers = capabilities?.Capability?.Layer?.Layer || [];

    // find matching layer by name
    const match = layers.find((l) => l.Name === layerName) || {};

    // get time values
    const timeValueStr =
      match?.Dimension?.find((d) => d.name === "time")?.values || [];

    let dateRange = timeValueStr.split("/");

    if (!!dateRange.length && dateRange.length > 1) {
      const isoDuration = dateRange[dateRange.length - 1];
      const durationMilliseconds = parseISO8601Duration(isoDuration);
      const durationDays = durationMilliseconds / 8.64e7;

      // if the interval is less that 24 hours, by default return dates for the past one month only.
      // This is a quick implementation to avoid the browser hanging.
      // In future we can implement this with web workers to show all the dates
      if (durationDays < 1) {
        const endTime = new Date(dateRange[1]);
        const startTime = subDays(endTime, 2);

        return getValidTimestamps(
          `${startTime.toISOString()}/${endTime.toISOString()}/${isoDuration}`
        );
      }

      return getValidTimestamps(timeValueStr);
    }

    return timeValueStr.split(",");
  } catch (error) {
    console.error(
      `Error fetching or parsing GetCapabilities document: ${error.message}`
    );
    return [];
  }
};

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
