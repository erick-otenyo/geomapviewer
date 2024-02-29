import {
  fetchRasterPixelTimeseriesValue,
  fetchRasterGeostoreTimeseriesValue,
} from "@/services/analysis";

import getWidgetProps from "./selectors";

const getTimeseriesWidget = (config) => {
  return {
    ...config,
    getData: async (params) => {
      const {
        layerId,
        geostore: { info, geojson, id: geostoreId },
        isPoint,
        adm0,
        adm1,
        type,
        adm2,
        isAnalysis,
        token,
        time,
        timestamps,
        aggregationMethod,
      } = params;

      // const startDateTime = parseISO(time);

      // if point, make a FeatureCollection and run analysis
      if (isPoint) {
        const lat = parseFloat(adm0);
        const lng = parseFloat(adm1);

        const args = {
          layerId: layerId,
          startTime: timestamps ? timestamps[0] : time,
          lat: lat,
          lng: lng,
        };

        const allArgsAvailable = Object.values(args).every(
          (value) => value !== undefined && value !== null && value !== ""
        );

        if (allArgsAvailable) {
          return fetchRasterPixelTimeseriesValue(args);
        }
      } else {
        if (geostoreId) {
          const args = {
            layerId: layerId,
            startTime: timestamps ? timestamps[0] : time,
            geostoreId: geostoreId,
            valueType: aggregationMethod,
          };

          const allArgsAvailable = Object.values(args).every(
            (value) => value !== undefined && value !== null && value !== ""
          );

          if (allArgsAvailable) {
            return fetchRasterGeostoreTimeseriesValue(args);
          }
        }
      }
    },
    getWidgetProps,
  };
};

export default getTimeseriesWidget;
