import { get } from "axios";
import xml2js from "xml2js";

export const getTimeValuesFromWMS = async (wmsUrl, layerName) => {
  const getCapabilitiesUrl = `${wmsUrl}?request=GetCapabilities&service=WMS&version=1.3.0`;

  try {
    // Fetch the GetCapabilities document from the WMS server
    const response = await get(getCapabilitiesUrl);
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
