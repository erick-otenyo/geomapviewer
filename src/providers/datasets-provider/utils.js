import { fetchRasterTimestamps } from "@/services/timestamps";
import { getTimeValuesFromWMS } from "@/utils/wms";
import { getNextDate } from "@/utils/time";

const rasterFileUpdateProvider = (layer) => {
  const { id: layerId, currentTimeMethod, autoUpdateInterval } = layer;

  return {
    layer: layerId,
    getTimestamps: () => {
      return fetchRasterTimestamps(layerId).then((timestamps) => {
        return timestamps;
      });
    },
    getCurrentLayerTime: (timestamps) => {
      let currentTime = timestamps[timestamps.length - 1];

      switch (currentTimeMethod) {
        case "next_to_now":
          const nextDate = getNextDate(timestamps);
          if (nextDate) {
            currentTime = nextDate;
          }
          break;
        default:
          break;
      }

      return currentTime;
    },
    ...(!!autoUpdateInterval && {
      updateInterval: autoUpdateInterval,
    }),
  };
};

const wmsUpdateProvider = (layer) => {
  const {
    id: layerId,
    getCapabilitiesUrl,
    layerName,
    autoUpdateInterval,
  } = layer;

  return {
    layer: layerId,
    getTimestamps: () => {
      return getTimeValuesFromWMS(getCapabilitiesUrl, layerName).then(
        (timestamps) => {
          return timestamps;
        }
      );
    },
    getCurrentLayerTime: (timestamps) => {
      const nextDate = getNextDate(timestamps);

      if (nextDate) {
        return nextDate;
      }

      return timestamps[timestamps.length - 1];
    },
    ...(!!autoUpdateInterval && {
      updateInterval: autoUpdateInterval,
    }),
  };
};

export const createUpdateProviders = (activeLayers) => {
  const providers = activeLayers.reduce((all, layer) => {
    const { layerType, multiTemporal } = layer;

    let provider;

    if (multiTemporal && layerType) {
      switch (layerType) {
        case "file":
          provider = rasterFileUpdateProvider(layer);
          break;
        case "wms":
          provider = wmsUpdateProvider(layer);
        default:
          break;
      }
    }

    if (provider) {
      all.push(provider);
    }

    return all;
  }, []);

  return providers;
};
