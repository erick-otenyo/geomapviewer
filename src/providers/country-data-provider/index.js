import { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import reducerRegistry from "@/redux/registry";
import { CancelToken } from "axios";

import { getDataLocation } from "@/utils/location";

import * as actions from "./actions";
import reducers, { initialState } from "./reducers";

const mapStateToProps = (state) => ({
  location: getDataLocation(state),
});

class CountryDataProvider extends PureComponent {
  componentDidMount() {
    const {
      location: { adm0, adm1, type },
      getCountries,
    } = this.props;

    if (type !== "point" || type !== "use") {
      getCountries();

      if (adm0) {
        this.handleRegionFetch(adm0);
      }
      if (adm1) {
        this.handleSubRegionFetch({ adm0, adm1 });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location: { adm0, adm1, type },
    } = this.props;

    const hasCountryChanged = adm0 && adm0 !== prevProps.location.adm0;
    const hasRegionChanged = adm0 && adm1 && adm1 !== prevProps.location.adm1;

    if (type !== "point" || type !== "use") {
      if (hasCountryChanged) {
        this.handleRegionFetch(adm0);
        if (adm1) {
          this.handleSubRegionFetch({ adm0, adm1 });
        }
      }

      if (hasRegionChanged) {
        this.handleSubRegionFetch({ adm0, adm1 });
      }
    }
  }

  handleRegionFetch = (adm0) => {
    const { getRegions } = this.props;

    this.cancelRegionsFetch();
    this.regionsFetch = CancelToken.source();
    getRegions({ adm0, token: this.regionsFetch.token });
  };

  handleSubRegionFetch = (params) => {
    const { getSubRegions } = this.props;
    this.cancelSubRegionsFetch();
    this.subRegionsFetch = CancelToken.source();
    getSubRegions({ ...params, token: this.subRegionsFetch.token });
  };

  cancelRegionsFetch = () => {
    if (this.regionsFetch) {
      this.regionsFetch.cancel("Cancelling regions fetch");
    }
  };

  cancelSubRegionsFetch = () => {
    if (this.subRegionsFetch) {
      this.subRegionsFetch.cancel("Cancelling regions fetch");
    }
  };

  render() {
    return null;
  }
}

CountryDataProvider.propTypes = {
  getCountries: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  getRegions: PropTypes.func.isRequired,
  getSubRegions: PropTypes.func.isRequired,
};

reducerRegistry.registerModule("countryData", {
  actions,
  reducers,
  initialState,
});

export default connect(mapStateToProps, actions)(CountryDataProvider);
