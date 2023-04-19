import { createElement, PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";

import reducerRegistry from "@/redux/registry";

import { setShareModal } from "@/components/modals/share/actions";

import * as actions from "./actions";
import reducers, { initialState } from "./reducers";
import { getAnalysisProps } from "./selectors";
import AnalysisComponent from "./component";

class AnalysisContainer extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    getAnalysis: PropTypes.func,
    endpoints: PropTypes.array,
    clearAnalysis: PropTypes.func,
    setAnalysisLoading: PropTypes.func,
    analysisLocation: PropTypes.object,
  };

  componentDidMount() {
    const { endpoints, location, analysisLocation } = this.props;
    const hasLocationChanged = !isEqual(
      { ...location, endpoints },
      analysisLocation
    );
    if (
      hasLocationChanged &&
      location.type &&
      location.adm0 &&
      endpoints &&
      endpoints.length
    ) {
      this.handleFetchAnalysis(endpoints);
    }
  }

  componentDidUpdate(prevProps) {
    const { location, endpoints } = this.props;
    // get analysis if location changes
    if (
      location.type &&
      location.adm0 &&
      endpoints &&
      endpoints.length &&
      (!isEqual(endpoints, prevProps.endpoints) ||
        !isEqual(location, prevProps.location))
    ) {
      this.handleFetchAnalysis(endpoints);
    }
  }

  componentWillUnmount() {
    if (this.analysisFetch) {
      this.analysisFetch.cancel();
    }
  }

  handleFetchAnalysis = (endpoints) => {
    if (this.analysisFetch) {
      this.analysisFetch.cancel();
    }

    const { geostore } = this.props;

    this.props.getAnalysis({
      endpoints,
      ...this.props.location,
      geostore,
      token: this.analysisFetch.token,
    });
  };

  handleCancelAnalysis = () => {
    const { clearAnalysis, setAnalysisLoading } = this.props;
    clearAnalysis();
    if (this.analysisFetch) {
      this.analysisFetch.cancel();
    }
    setAnalysisLoading({ loading: false, error: "", errorMessage: "" });
  };

  render() {
    return createElement(AnalysisComponent, {
      ...this.props,
      handleFetchAnalysis: this.handleFetchAnalysis,
      handleCancelAnalysis: this.handleCancelAnalysis,
    });
  }
}

reducerRegistry.registerModule("analysis", {
  actions,
  reducers,
  initialState,
});

export default connect(getAnalysisProps, {
  ...actions,
  setShareModal,
})(AnalysisContainer);
