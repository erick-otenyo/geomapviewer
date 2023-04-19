import { createSelector, createStructuredSelector } from "reselect";

import { objDiff } from "@/utils/data";

import { initialState as mapInitialState } from "@/components/map/reducers";
import { initialState as mainMapInitialState } from "@/layouts/map/reducers";
import { initialState as mapMenuInitialState } from "@/components/map-menu/reducers";
import { initialState as analysisInitialState } from "@/components/analysis/reducers";
import { initialState as mapPromptsInitialState } from "@/components/prompts/map-prompts/reducers";

export const selectMapSettings = (state) => state.map?.settings;
export const selectMainMapSettings = (state) => state.mainMap;
export const selectMapMenuSettings = (state) => state.mapMenu?.settings;
export const selectAnalysisSettings = (state) => state.analysis?.settings;
export const selectMetaModalKey = (state) => state.modalMeta?.metakey;
export const selectMapPromptsSettings = (state) => state.mapPrompts?.settings;
export const selectAOIModalSettings = (state) => state.areaOfInterestModal;

export const getUrlParams = createSelector(
  [
    selectMapSettings,
    selectMainMapSettings,
    selectMapMenuSettings,
    selectAnalysisSettings,
    selectMetaModalKey,
    selectMapPromptsSettings,
    selectAOIModalSettings,
  ],
  (map, mainMap, mapMenu, analysis, modalMeta, mapPrompts) => {
    return {
      map: objDiff(map, mapInitialState.settings),
      mainMap: objDiff(mainMap, mainMapInitialState),
      mapMenu: objDiff(mapMenu, mapMenuInitialState.settings),
      analysis: objDiff(analysis, analysisInitialState.settings),
      modalMeta,
      mapPrompts: objDiff(mapPrompts, mapPromptsInitialState.settings),
    };
  }
);

export default createStructuredSelector({
  urlParams: getUrlParams,
});
