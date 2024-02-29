import { createSelector, createStructuredSelector } from "reselect";
import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import groupBy from "lodash/groupBy";
import flatMap from "lodash/flatMap";

import { getAllLayers, getActiveDatasets } from "@/components/map/selectors";
import { getWidgets } from "@/components/widgets/selectors";
import { getActiveArea } from "@/providers/aoi-provider/selectors";

import { getDataLocation, locationLevelToStr } from "@/utils/location";

const selectAnalysisLoading = (state) =>
  state.analysis && state.analysis.loading;
const selectDatasetsLoading = (state) =>
  state.datasets && state.datasets.loading;
const selectGeostoreLoading = (state) =>
  state.geostore && state.geostore.loading;
const selectSearch = (state) => state.location && state.location.search;
const selectAnalysisLocation = (state) =>
  state.analysis && state.analysis.location;
const selectEmbed = (state) => state.location?.pathname?.includes("/embed");
const selectError = (state) =>
  (state.analysis && state.analysis.error) ||
  (state.geostore && state.geostore.error);
const selectGeostoreError = (state) => state.geostore?.error;
const selectDatasets = (state) => state.datasets && state.datasets.data;
const selectGeostoreSize = (state) =>
  state.geostore && state.geostore.data && state.geostore.data.areaHa;

export const getLoading = createSelector(
  [selectAnalysisLoading, selectDatasetsLoading, selectGeostoreLoading],
  (analysisLoading, datasetsLoading, geostoreLoading) =>
    analysisLoading || datasetsLoading || geostoreLoading
);

export const getBoundaryDatasets = createSelector(
  [selectDatasets],
  (datasets) => {
    if (isEmpty(datasets)) return null;
    return datasets
      .filter((d) => d.isBoundary)
      .map((d) => ({
        name: d.name,
        dataset: d.id,
        layers: d.layers.map((l) => l.id),
        id: d.id,
        label: d.name,
        value: d.layer,
      }));
  }
);

export const getAllBoundaries = createSelector(
  [getBoundaryDatasets],
  (boundaries) =>
    [{ label: "No boundaries", value: "no-boundaries" }].concat(boundaries)
);

export const getActiveBoundaryDatasets = createSelector(
  [getBoundaryDatasets, getActiveDatasets],
  (datasets, activeDatasets) => {
    if (isEmpty(datasets) || isEmpty(activeDatasets)) return null;
    const datasetIds = activeDatasets.map((d) => d.dataset);
    return datasets.find((d) => datasetIds.includes(d.dataset));
  }
);

export const getWidgetLayers = createSelector(
  [getWidgets],
  (widgets) =>
    widgets &&
    flatMap(
      widgets.map((w) =>
        flatMap(
          w.datasets &&
            w.datasets.map((d) =>
              Array.isArray(d.layers) ? d.layers : Object.values(d.layers)
            )
        )
      )
    )
);

export const checkGeostoreSize = createSelector(
  [selectGeostoreSize, getDataLocation],
  (areaHa, location) => {
    if (["aoi", "geostore", "use"].includes(location.type)) {
      const ONE_BILLION_H = 1000000000;
      return areaHa > ONE_BILLION_H;
    }

    return false;
  }
);

export const getAnalysisProps = createStructuredSelector({
  loading: getLoading,
  error: selectError,
  geostoreError: selectGeostoreError,
  embed: selectEmbed,
  location: getDataLocation,
  boundaries: getAllBoundaries,
  activeBoundary: getActiveBoundaryDatasets,
  widgetLayers: getWidgetLayers,
  analysisLocation: selectAnalysisLocation,
  search: selectSearch,
  areaTooLarge: checkGeostoreSize,
  activeArea: getActiveArea,
});
