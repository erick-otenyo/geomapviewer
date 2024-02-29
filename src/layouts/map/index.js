import { createElement, PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import flatMap from "lodash/flatMap";
import { trackEvent } from "@/utils/analytics";
import reducerRegistry from "@/redux/registry";

import { getGeostoreId } from "@/providers/geostore-provider/actions";
import { setMapPromptsSettings } from "@/components/prompts/map-prompts/actions";
import { setMenuSettings } from "@/components/map-menu/actions";
import { setMapSettings } from "@/components/map/actions";

import reducers, { initialState } from "./reducers";
import * as ownActions from "./actions";
import { getMapProps } from "./selectors";
import MapComponent from "./component";

const actions = {
  setMenuSettings,
  setMapSettings,
  setMapPromptsSettings,
  getGeostoreId,
  ...ownActions,
};

class MainMapContainer extends PureComponent {
  componentDidMount() {
    const { activeDatasets, basemap } = this.props;
    const layerIds = flatMap(activeDatasets?.map((d) => d.layers));

    trackEvent({
      category: "Map data",
      action: "Initial layers loaded",
      label: layerIds && layerIds.join(", "),
    });

    trackEvent({
      category: "Map data",
      action: "initial basemap loaded",
      label: basemap?.value,
    });
  }

  componentDidUpdate(prevProps) {
    const { setMainMapSettings, analysisActive, geostoreId, location } =
      this.props;

    if (!analysisActive && geostoreId && geostoreId !== prevProps.geostoreId) {
      setMainMapSettings({ showAnalysis: true });
    }

    if (
      location?.type === "aoi" &&
      location?.type !== prevProps.location.type
    ) {
      this.props.setMenuSettings({ menuSection: "my-hw" });
    }
  }

  handleClickMap = () => {
    const { menuSection, recentActive, location } = this.props;

    if (menuSection) {
      this.props.setMenuSettings({
        menuSection: recentActive ? "recent-imagery-collapsed" : "",
      });
    }

    if (location?.type) {
      this.props.setMapPromptsSettings({
        open: true,
        stepsKey: "subscribeToArea",
        stepIndex: 0,
      });
    }
  };

  handleClickAnalysis = (selected) => {
    const { data, layer, geometry, isPoint } = selected;
    const { gid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};
    const isUse = gid && tableName;

    const isAdmin = analysisEndpoint === "admin";

    const { setMainMapAnalysisView } = this.props;
    if (isAdmin || isPoint || isUse) {
      setMainMapAnalysisView(selected);
    } else {
      this.onDrawComplete(geometry);
    }
  };

  onDrawComplete = (geojson) => {
    const { setDrawnGeostore } = this.props;

    this.props.getGeostoreId({ geojson, callback: setDrawnGeostore });
  };

  render() {
    return createElement(MapComponent, {
      ...this.props,
      ...this.state,
      handleClickAnalysis: this.handleClickAnalysis,
      handleClickMap: this.handleClickMap,
      onDrawComplete: this.onDrawComplete,
    });
  }
}

MainMapContainer.propTypes = {
  setMainMapAnalysisView: PropTypes.func,
  getGeostoreId: PropTypes.func,
  setMenuSettings: PropTypes.func,
  setMainMapSettings: PropTypes.func,
  setMapPromptsSettings: PropTypes.func,
  setDrawnGeostore: PropTypes.func,
  activeDatasets: PropTypes.array,
  menuSection: PropTypes.string,
  analysisActive: PropTypes.bool,
  location: PropTypes.object,
  geostoreId: PropTypes.string,
  basemap: PropTypes.object,
  recentActive: PropTypes.bool,
};

reducerRegistry.registerModule("mainMap", {
  actions,
  reducers,
  initialState,
});

export default connect(getMapProps, actions)(MainMapContainer);
