import { connect } from "react-redux";

import * as modalMetaActions from "@/components/modals/meta/actions";
import * as modalShareActions from "@/components/modals/share/actions";
import { setMenuSettings } from "@/components/map-menu/actions";
import * as dataAnalysisActions from "@/components/analysis/actions";

import { getShowAnalysisProps } from "./selectors";
import Component from "./component";

const actions = {
  ...modalMetaActions,
  ...modalShareActions,
  ...dataAnalysisActions,
  setMenuSettings,
};

export default connect(getShowAnalysisProps, actions)(Component);
