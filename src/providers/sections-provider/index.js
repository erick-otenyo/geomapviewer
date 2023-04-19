import { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import reducerRegistry from "@/redux/registry";

import * as actions from "./actions";
import reducers, { initialState } from "./reducers";

class SectionsProvider extends PureComponent {
  componentDidMount() {
    const { fetchSections } = this.props;

    fetchSections();
  }

  render() {
    return null;
  }
}

SectionsProvider.propTypes = {
  fetchSections: PropTypes.func.isRequired,
};

reducerRegistry.registerModule("sections", {
  actions,
  reducers,
  initialState,
});

export default connect(null, actions)(SectionsProvider);
