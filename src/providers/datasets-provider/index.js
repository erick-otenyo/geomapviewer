import { PureComponent, createRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import reducerRegistry from "@/redux/registry";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

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

  componentDidUpdate(prevProps, prevState) {
    const {
      activeDatasets: prevActiveDatasets,
      geostore: prevGeostore,
      mapLocationGeostore: prevMapLocationGeostore,
      clipToGeostore: prevClipToGeostore,
    } = prevProps;

    const { activeDatasets, clipToGeostore, mapLocationGeostore, geostore } =
      this.props;

    const shouldUpdateClipping =
      !isEqual(geostore, prevGeostore) ||
      !isEqual(mapLocationGeostore, prevMapLocationGeostore) ||
      clipToGeostore !== prevClipToGeostore ||
      !isEqual(activeDatasets, prevActiveDatasets);

    if (shouldUpdateClipping) {
      this.doUpdateClipping();
    }
  }

  doUpdateClipping = () => {
    const {
      clipToGeostore,
      mapLocationGeostore,
      geostore,
      setDatasetParams,
      layers,
      mapLocationContext,
      updateProviders,
    } = this.props;

    updateProviders.forEach((update) => {
      const { paramClipByGeostore, paramClipByMapLocationContext, layer } =
        update;

      const activeLayer = layers.find((l) => l.id === layer);

      if (activeLayer) {
        const { dataset, layerConfig } = activeLayer;
        const { canClipToGeom } = layerConfig;

        if (
          canClipToGeom ||
          paramClipByGeostore ||
          paramClipByMapLocationContext
        ) {
          if (canClipToGeom) {
            let geostoreObj;

            if (!isEmpty(mapLocationGeostore)) {
              geostoreObj = mapLocationGeostore;
            }

            if (!isEmpty(geostore)) {
              geostoreObj = geostore;
            }

            const params = {
              geojson_feature_id:
                clipToGeostore && !isEmpty(geostoreObj) ? geostoreObj.id : "",
            };

            setDatasetParams({ dataset: dataset, params: params });
          }

          if (paramClipByMapLocationContext) {
            const { param, value } =
              paramClipByMapLocationContext(
                clipToGeostore ? mapLocationContext : null
              ) || {};
            if (param && value) {
              const params = { [param]: value };

              setDatasetParams({ dataset: dataset, params: params });
            }
          }

          if (paramClipByGeostore && !isEmpty(geostore)) {
            const { param, value } =
              paramClipByGeostore(clipToGeostore ? geostore : null) || {};
            if (param && value) {
              const params = { [param]: value };
              setDatasetParams({ dataset: dataset, params: params });
            }
          }
        }
      }
    });
  };

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
