import { createSelector, createStructuredSelector } from "reselect";
import sumBy from "lodash/sumBy";

import { locationLevelToStr } from "@/utils/location";
import { getGeodescriberTitle } from "@/providers/geodescriber-provider/selectors";

import { getActiveLayers, getMapZoom } from "@/components/map/selectors";
import { getWidgetLayers, getLoading } from "@/components/analysis/selectors";

const selectLocation = (state) => state.location && state.location.payload;
const selectData = (state) => state.analysis && state.analysis.data;
const selectError = (state) => state.analysis && state.analysis.error;
const selectGeostore = (state) => state.geostore && state.geostore.data;

export const getShowAnalysisProps = createStructuredSelector({
  loading: getLoading,
  layers: getActiveLayers,
  error: selectError,
  widgetLayers: getWidgetLayers,
  zoomLevel: getMapZoom,
  analysisTitle: getGeodescriberTitle,
  location: selectLocation,
  geostore: selectGeostore,
});
