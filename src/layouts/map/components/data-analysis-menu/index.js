import { connect } from "react-redux";

import { clearAnalysisError, clearAnalysis } from "@/components/analysis/actions";
import { setMainMapSettings } from "@/layouts/map/actions";
import { setMapSettings } from "@/components/map/actions";

import { getDataAnalysisMenuProps } from "./selectors";
import Component from "./component";

export default connect(getDataAnalysisMenuProps, {
  clearAnalysis,
  clearAnalysisError,
  setMainMapSettings,
  setMapSettings,
})(Component);
