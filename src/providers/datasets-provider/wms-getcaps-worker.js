import * as Comlink from "comlink";
import xmldom from "xmldom";
import WMSCapabilities from "wms-capabilities";
import { get } from "axios";
import { subMonths, subDays } from "date-fns";

import { parse, toSeconds } from "iso8601-duration";

function parseISO8601Duration(durationString) {
  const seconds = toSeconds(parse(durationString));
  return seconds * 1000; // convert to milliseconds
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

const wmsGetLayerTimeFromCapabilities = async (
  wmsUrl,
  layerName,
  params = {}
) => {
  try {
    // Fetch the GetCapabilities document from the WMS server
    const response = await get(wmsUrl, {
      params: { ...params },
    });

    // parse xml
    const capabilities = new WMSCapabilities(
      response.data,
      xmldom.DOMParser
    ).toJSON();

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

    const timestamps = timeValueStr.split(",");

    // sort by date
    timestamps.sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    return timestamps;
  } catch (error) {
    console.error(
      `Error fetching or parsing GetCapabilities document: ${error.message}`
    );
    return [];
  }
};

const api = {
  wmsGetLayerTimeFromCapabilities: wmsGetLayerTimeFromCapabilities,
};

Comlink.expose(api);
