import { connect } from "react-redux";

import Component from "./component";

import { getAttributionProps } from "./selectors";

export default connect(getAttributionProps, {})(Component);
