import { connect } from "react-redux";
import reducerRegistry from "@/redux/registry";

import { setMapSettings } from "@/components/map/actions";
import { setMenuSettings } from "@/components/map-menu/actions";
import { setMainMapSettings } from "@/layouts/map/actions";

import {
  setMapPromptsSettings,
  setShowMapPrompts,
} from "@/components/prompts/map-prompts/actions";

import { selectShowMapPrompts } from "@/components/prompts/map-prompts/selectors";

import * as actions from "./actions";
import reducers, { initialState } from "./reducers";
import Component from "./component";

const mapStateToProps = (state) => {
  const { open, hideModal } = state.modalWelcome || {};

  return {
    open,
    showPrompts: selectShowMapPrompts(state),
    title: hideModal ? "Map How-To Guide" : "Welcome to the Map Viewer!",
    description: "What would you like to do?",
  };
};

reducerRegistry.registerModule("modalWelcome", {
  actions,
  reducers,
  initialState,
});

export default connect(mapStateToProps, {
  ...actions,
  setMapPromptsSettings,
  setShowMapPrompts,
  setMenuSettings,
  setMapSettings,
  setMainMapSettings,
})(Component);
