import { createStructuredSelector } from "reselect";

import {
  getActiveDatasetsFromState,
  getDrawing,
  getDrawingMode,
} from "@/components/map/selectors";
import {
  getAllBoundaries,
  getActiveBoundaryDatasets,
} from "@/components/analysis/selectors";

export const selectError = (state) => state.analysis && state.analysis.error;
export const selectErrorMessage = (state) =>
  state.analysis && state.analysis.errorMessage;
const selectUploading = (state) => state.analysis && state.analysis.uploading;
const getShowDraw = (state) => state.analysis?.settings?.showDraw;
const selectMapComparing = (state) => state.map?.settings?.comparing;

export const getChooseAnalysisProps = createStructuredSelector({
  showDraw: getShowDraw,
  error: selectError,
  errorMessage: selectErrorMessage,
  boundaries: getAllBoundaries,
  activeBoundary: getActiveBoundaryDatasets,
  activeDatasets: getActiveDatasetsFromState,
  drawing: getDrawing,
  drawingMode: getDrawingMode,
  uploading: selectUploading,
  isMapComparing: selectMapComparing,
});
