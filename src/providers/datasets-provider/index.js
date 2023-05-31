import { PureComponent, createRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import reducerRegistry from "@/redux/registry";

import * as ownActions from "./actions";
import reducers, { initialState } from "./reducers";
import { getDatasetProps } from "./selectors";
import { setMapSettings } from "@/components/map/actions";
import LayerUpdate from "./Update";

const actions = {
  ...ownActions,
  setMapSettings,
};

class DatasetsProvider extends PureComponent {
  componentDidMount() {
    const { fetchDatasets, activeDatasets } = this.props;

    fetchDatasets(activeDatasets);
  }

  getLayerUpdateComponents = () => {
    const { updateProviders } = this.props;

    return updateProviders.map((t) => <LayerUpdate key={t.layer} {...t} />);
  };

  render() {
    return this.getLayerUpdateComponents();
  }
}

DatasetsProvider.propTypes = {
  fetchDatasets: PropTypes.func.isRequired,
  activeDatasets: PropTypes.array,
};

reducerRegistry.registerModule("datasets", {
  actions,
  reducers,
  initialState,
});

export default connect(getDatasetProps, actions)(DatasetsProvider);
