import { connect } from "react-redux";
import CookiesBannerComponent from "./component";

import { getProps } from "./selectors";

export default connect(getProps, null)(CookiesBannerComponent);
