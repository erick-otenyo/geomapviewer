import { fetchRasterTimestamps } from "@/services/timestamps";

const rasterFileUpdateProvider = (layer) => {
  const { id: layerId } = layer;

  return {
    layer: layerId,
    getTimestamps: () => {
      return fetchRasterTimestamps(layerId).then((timestamps) => {
        console.log(timestamps);
        return timestamps;
      });
    },
  };
};

export const createUpdateProviders = (activeLayers) => {
  const providers = activeLayers.reduce((all, layer) => {
    const { layerType, multiTemporal } = layer;

    let provider;

    if (multiTemporal && layerType && layerType === "file") {
      provider = rasterFileUpdateProvider(layer);
    }

    if (provider) {
      all.push(provider);
    }

    return all;
  }, []);

  return providers;
};
