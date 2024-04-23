import { connect } from "react-redux";

import * as actions from "./actions";
import Component from "./component";

const mapStateToProps = ({ config }) => {
  const { allowSignups } = config;

  return {
    allowSignups,
  };
};

export default connect(mapStateToProps, actions)(Component);
