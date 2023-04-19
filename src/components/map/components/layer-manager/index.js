import { connect } from "react-redux";

import { setMapLoading, setMapSettings } from "@/components/map/actions";
import { setMainMapSettings } from "@/layouts/map/actions";

import { getLayerManagerProps } from "./selectors";
import Component from "./component";

export default connect(getLayerManagerProps, {
  setMapLoading,
  setMapSettings,
  setMainMapSettings,
})(Component);
