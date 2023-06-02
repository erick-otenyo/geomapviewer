import { connect } from "react-redux";

import { viewArea } from "@/providers/aoi-provider/actions";
import { setAreaOfInterestModalSettings } from "@/components/modals/area-of-interest/actions";
import { setMapPromptsSettings } from "@/components/prompts/map-prompts/actions";
import { setShareModal } from "@/components/modals/share/actions";
import { setMenuSettings } from "@/components/map-menu/actions";

import Component from "./component";
import { mapStateToProps } from "./selectors";
import { setProfileModalOpen } from "@/components/modals/profile/actions";

export default connect(mapStateToProps, {
  viewArea,
  setShareModal,
  setMenuSettings,
  setMapPromptsSettings,
  setProfileModalOpen,
  onEditClick: setAreaOfInterestModalSettings,
})(Component);
