import weather from "./weather";
import satellite from "./satellite";

const allDatasets = [...weather.datasets, ...satellite.datasets];

export const layersUpdateProviders = [...weather.updates, ...satellite.updates];

export default allDatasets;
