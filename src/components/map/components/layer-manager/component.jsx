import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { LayerManager, Layer } from "@wmo-raf/layer-manager/dist/components";
import { PluginMapboxGl } from "@wmo-raf/layer-manager";

class LayerManagerComponent extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    layers: PropTypes.array,
    basemap: PropTypes.object,
    setMapLoading: PropTypes.func,
    map: PropTypes.object,
    allDatasets: PropTypes.array,
    activeDatasets: PropTypes.array,
  };

  state = {
    layerModels: {},
  };

  componentDidUpdate(prevProps, prevState) {
    const { layers } = this.props;

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (this.state.layerModels[layer.id]) {
        this.setLayerFilter(layer.id, layer.layerFilterParams, layer);
      }
    }
  }

  setLayerFilter = (layerId, filterParams, layer) => {
    const { map } = this.props;

    const layerModel = this.state.layerModels[layerId];

    const layersWithFilters = layerModel.layers.filter((l) => l.filter);

    const { layerFilterParamsConfig } = layer;

    const filterKey =
      layerFilterParamsConfig &&
      layerFilterParamsConfig[0] &&
      layerFilterParamsConfig[0].key;

    for (let i = 0; i < layersWithFilters.length; i++) {
      const mapLayer = layersWithFilters[i];

      Object.keys(filterParams).forEach((filterParam) => {
        if (filterParams[filterKey]) {
          const literalVals = filterParams[filterKey].map((f) => f.value);

          // filter: ["in", ["get", "severity"], ["literal", [5, 4, 3, 2]]],

          const lFilter = ["in", ["get", filterKey], ["literal", literalVals]];

          map.setFilter(mapLayer.id, lFilter);
        }

        // if (layer.filter[1][1] === filterParam) {
        //   let filterValues;

        //   if (Array.isArray(filterParams[filterParam])) {
        //     filterValues = filterParams[filterParam].map((o) => o.value);
        //   } else {
        //     filterValues = [filterParams[filterParam].value];
        //   }

        //   if (
        //     filterValues.length &&
        //     filterValues.length === 1 &&
        //     filterValues[0] === "all"
        //   ) {
        //     if (map) {
        //       map.setFilter(layer.id, null);
        //     }
        //   } else {
        //     const filterWithParams = ["in", filterParam].concat(filterValues);

        //     layer.filter[1] = filterWithParams;

        //     if (map) {
        //       map.setFilter(layer.id, layer.filter);
        //     }
        //   }
        // }
      });
    }
  };

  handleOnAdd = (layerModel) => {
    const { layerConfig } = layerModel;

    const { allDatasets, activeDatasets, setMapSettings, setMainMapSettings } =
      this.props;

    if (layerModel && layerModel.isMultiLayer && layerModel.isDefault) {
      const { dataset, linkedLayers, showAllMultiLayer } = layerModel;

      // NOTE: Add related layers. This are layers that should be switched on together as a group
      if (showAllMultiLayer && linkedLayers && !!linkedLayers.length) {
        const newActiveDatasets = activeDatasets.map((newDataset, i) => {
          if (newDataset.dataset === dataset) {
            const newActiveDataset = activeDatasets[i];
            return {
              ...newActiveDataset,
              layers: [...newActiveDataset.layers, ...linkedLayers],
            };
          }
          return newDataset;
        });

        setMapSettings({ datasets: newActiveDatasets, canBound: true });
      }
    }

    if (layerModel.layerFilterParams) {
      this.setState({
        layerModels: {
          ...this.state.layerModels,
          [layerModel.id]: layerModel.mapLayer,
        },
      });
    }
  };

  handleOnRemove = (layerModel) => {};

  render() {
    const { layers, basemap, map, mapSide } = this.props;

    let filteredLayers = layers;

    if (mapSide) {
      filteredLayers = layers.filter(
        (l) => (l.mapSide && l.mapSide === mapSide) || l.isBoundary
      );
    }

    const basemapLayer =
      basemap && basemap.url
        ? {
            id: basemap.url,
            name: "Basemap",
            layerConfig: {
              type: "raster",
              source: {
                type: "raster",
                tiles: [basemap.url],
              },
            },
            zIndex: 100,
          }
        : null;

    const allLayers = [basemapLayer].concat(filteredLayers).filter((l) => l);

    return (
      <LayerManager map={map} plugin={PluginMapboxGl} providers={{}}>
        {allLayers &&
          allLayers.map((l) => {
            const config = l.config ? l.config : l.layerConfig;
            return (
              <Layer
                key={l.id}
                {...l}
                {...config}
                onAfterAdd={this.handleOnAdd}
                onAfterRemove={this.handleOnRemove}
              />
            );
          })}
      </LayerManager>
    );
  }
}

export default LayerManagerComponent;
