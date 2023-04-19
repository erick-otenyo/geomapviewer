import { connect } from "react-redux";

import * as actions from "@/components/map/actions";
import MapTooltipComponent from "./component";
import { getMapTooltipProps } from "./selectors";

export default connect(getMapTooltipProps, actions)(MapTooltipComponent);
