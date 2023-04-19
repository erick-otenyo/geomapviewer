import { connect } from "react-redux";

import Component from "./component";
import { getCapAlertCardProps } from "./selectors";

export default connect(getCapAlertCardProps)(Component);
