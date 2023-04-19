import { createSelector, createStructuredSelector } from "reselect";
import { getActiveLayers } from "@/components/map/selectors";

export const getProps = createStructuredSelector({
  activeLayers: getActiveLayers,
});
