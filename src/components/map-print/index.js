import { connect } from "react-redux";

import MapPrintComponent from "./component";
import { getProps } from "./selectors";

export default connect(getProps, null)(MapPrintComponent);
