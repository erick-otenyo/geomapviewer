import { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import { cancelToken } from "@/utils/request";
import reducerRegistry from "@/redux/registry";

import { getDataLocation } from "@/utils/location";

import * as actions from "./actions";
import reducers, { initialState } from "./reducers";

const mapStateToProps = (state) => {
  const { location, areas } = state;

  return {
    location: getDataLocation(state),
    activeArea:
      areas &&
      areas.data &&
      areas.data.find((a) => a.id === (location && location.payload.adm0)),
  };
};

class GeostoreProvider extends PureComponent {
  componentDidMount() {
    const {
      location: { adm0, type },
    } = this.props;

    const canGetGeostore = type !== "point" && adm0 && type !== "aoi";

    if (canGetGeostore) {
      this.handleGetGeostore();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location: { type, adm0, adm1, adm2 },
      activeArea,
      clearGeostore,
    } = this.props;

    const hasAdm0Changed = adm0 && adm0 !== prevProps.location.adm0;
    const hasAdm1Changed = adm0 && adm1 !== prevProps.location.adm1;
    const hasAdm2Changed = adm0 && adm1 && adm2 !== prevProps.location.adm2;
    const hasAoiChanged =
      activeArea && !isEqual(activeArea, prevProps.activeArea);

    if (!adm0 && adm0 !== prevProps.location.adm0) {
      this.cancelGeostoreFetch();
      clearGeostore({});
    }

    if (
      (type !== "aoi" && hasAdm0Changed) ||
      hasAdm1Changed ||
      hasAdm2Changed ||
      hasAoiChanged
    ) {
      this.handleGetGeostore();
    }
  }

  handleGetGeostore = () => {
    const { type } = this.props.location;

    if (type !== "point") {
      this.cancelGeostoreFetch();
      this.geostoreFetch = cancelToken();

      this.props.fetchGeostore({
        ...this.props.location,
        token: this.geostoreFetch.token,
      });
    }
  };

  cancelGeostoreFetch = () => {
    if (this.geostoreFetch) {
      this.geostoreFetch.cancel("Cancelling geostore fetch");
    }
  };

  render() {
    return null;
  }
}

GeostoreProvider.propTypes = {
  location: PropTypes.object.isRequired,
  fetchGeostore: PropTypes.func.isRequired,
  clearGeostore: PropTypes.func.isRequired,
  activeArea: PropTypes.object,
};

reducerRegistry.registerModule("geostore", {
  actions,
  reducers,
  initialState,
});

export default connect(mapStateToProps, actions)(GeostoreProvider);
