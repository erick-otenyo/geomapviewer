import { get } from "axios";
import xml2js from "xml2js";

import request from "@/utils/request";

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
    const xml = response.data;

    // Parse the XML document to a JavaScript object
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    let capability = {};

    if (result.Capability) {
      capability = result.Capability[0];
    } else {
      if (result.WMS_Capabilities && result.WMS_Capabilities?.Capability) {
        capability = result.WMS_Capabilities.Capability[0];
      }
    }

    // Find the layer with the given name
    const layers = capability?.Layer[0]?.Layer;

    const layer = layers.find((l) => l?.Name[0] === layerName);

    if (!layer) {
      throw new Error(
        `Layer ${layerName} not found in GetCapabilities document.`
      );
    }

    // Extract the available time values for the layer
    const timeExtent = layer.Dimension.find((d) => d.$.name === "time");

    let timeValues = timeExtent["_"] || [];

    if (timeValues) {
      timeValues = timeValues.split(",");
    }

    return timeValues;
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
