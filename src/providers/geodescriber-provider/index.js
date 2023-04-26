import { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import reducerRegistry from "@/redux/registry";

import * as actions from "./actions";
import reducers, { initialState } from "./reducers";
import { getGeodescriberProps } from "./selectors";

class GeodescriberProvider extends PureComponent {
  static propTypes = {
    clearGeodescriber: PropTypes.func,
    location: PropTypes.object,
    loading: PropTypes.bool,
    embed: PropTypes.bool,
  };

  componentDidMount() {
    const { location, clearGeodescriber } = this.props;

    if (location.type === "point") {
      clearGeodescriber({});
    }
  }

  render() {
    return null;
  }
}

reducerRegistry.registerModule("geodescriber", {
  actions,
  reducers,
  initialState,
});

export default connect(getGeodescriberProps, actions)(GeodescriberProvider);
