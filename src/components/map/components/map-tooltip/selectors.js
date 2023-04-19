import { createSelector, createStructuredSelector } from "reselect";
import { getActiveLayers } from "@/components/map/selectors";

const getLatLng = (state) =>
  state.map &&
  state.map.data &&
  state.map.data.hoverInteraction &&
  state.map.data.hoverInteraction.latlng;

const getHoverFeature = (state) =>
  state.map &&
  state.map.data &&
  state.map.data.hoverInteraction &&
  state.map.data.hoverInteraction.feature;

export const getHoverFeatureData = createSelector(
  [getHoverFeature, getActiveLayers],
  (feature, layers) => {
    if (!feature) return null;
    const { layer, data } = feature;
    const datasetLayer = layers.find((l) => l.id === layer.source);
    const { hoverInteractionConfig } = datasetLayer || {};

    return (
      hoverInteractionConfig &&
      hoverInteractionConfig.output &&
      hoverInteractionConfig.output.map((c) => ({
        ...c,
        label: c.property,
        value: data[c.column],
      }))
    );
  }
);

export const getMapTooltipProps = createStructuredSelector({
  feature: getHoverFeature,
  latlng: getLatLng,
  data: getHoverFeatureData,
});
