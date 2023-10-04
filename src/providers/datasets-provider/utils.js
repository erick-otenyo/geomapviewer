import { fetchRasterTimestamps } from "@/services/timestamps";
import { getTimeValuesFromWMS } from "@/utils/wms";
import { getNextDate } from "@/utils/time";

import { POLITICAL_BOUNDARIES_DATASET } from "@/data/datasets";
import { POLITICAL_BOUNDARIES } from "@/data/layers";

const rasterFileUpdateProvider = (layer) => {
  const {
    id: layerId,
    currentTimeMethod,
    autoUpdateInterval,
    settings = {},
    tileJsonUrl,
  } = layer;

  const { autoUpdateActive = true } = settings;

  return {
    layer: layer,
    getTimestamps: () => {
      return fetchRasterTimestamps(tileJsonUrl).then((timestamps) => {
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
    ...(!!autoUpdateInterval &&
      autoUpdateActive && {
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
    layer: layer,
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

const rasterTileUpdateProvider = (layer) => {
  const {
    currentTimeMethod,
    autoUpdateInterval,
    settings = {},
    tileJsonUrl,
    timestampsResponseObjectKey = "timestamps",
  } = layer;

  const { autoUpdateActive = true } = settings;

  return {
    layer: layer,
    getTimestamps: () => {
      return fetchRasterTimestamps(
        tileJsonUrl,
        timestampsResponseObjectKey
      ).then((timestamps) => {
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
    ...(!!autoUpdateInterval &&
      autoUpdateActive && {
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
        case "raster_file":
          provider = rasterFileUpdateProvider(layer);
          break;
        case "wms":
          provider = wmsUpdateProvider(layer);
          break;
        case "raster_tile":
          provider = rasterTileUpdateProvider(layer);
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

export const getTimeseriesConfig = (layer, analysisType) => {
  let config = layer.analysisConfig.pointTimeseriesAnalysis;

  if (analysisType !== "point") {
    config = layer.analysisConfig.areaTimeseriesAnalysis;
  }

  const { chartType, chartColor } = config;

  return {
    widget: `widget-${layer.id}`,
    layerId: layer.id,
    datasetId: layer.dataset,
    title: `${layer.name} - Timeseries Analysis for {location}`,
    categories: [""],
    types: ["country", "geostore", "point"],
    admins: ["adm0", "adm1", "adm2"],
    large: true,
    metaKey: "",
    sortOrder: {},
    visible: ["analysis"],
    chartType: "composedChart",
    colors: "weather",
    sentences: {},
    settings: {
      time: "",
    },
    refetchKeys: ["time"],
    requiresTime: true,
    datasets: [
      {
        dataset: POLITICAL_BOUNDARIES_DATASET,
        layers: [POLITICAL_BOUNDARIES],
        boundary: true,
      },
      {
        dataset: layer.dataset,
        layers: [layer.id],
      },
    ],
    plotConfig: {
      simpleNeedsAxis: true,
      height: 250,
      yKeys: {
        [chartType]: {
          value: {
            yAxisId: "value",
            fill: chartColor,
            stroke: chartColor,
          },
        },
      },
      unit: config.unit || "",
      yAxis: {
        yAxisId: "value",
        domain: ["auto", "auto"],
      },
      xAxis: {
        dataKey: "date",
        tickDateFormat: "dd MMM yy",
      },
      tooltip: [
        {
          key: "date",
          label: "Date",
          formatConfig: {
            formatDate: true,
            dateFormat: "yyyy-mm-dd HH:MM",
          },
        },
        {
          key: "value",
          label: "Value",
          formatConfig: { formatNumber: true, units: config.unit || "" },
        },
      ],
    },
  };
};
