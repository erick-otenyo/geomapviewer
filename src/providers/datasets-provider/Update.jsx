import { PureComponent, createRef } from "react";
import bbox from "@turf/bbox";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { wrap } from "comlink";

import { parse, end, toSeconds, pattern } from "iso8601-duration";

import * as ownActions from "./actions";
import { getDatasetProps } from "./selectors";
import { setMapSettings } from "@/components/map/actions";
import { parseISO } from "date-fns";

const actions = {
  ...ownActions,
  setMapSettings,
};

class LayerUpdate extends PureComponent {
  wmsWorkerRef = createRef();

  componentDidMount() {
    const { updateInterval } = this.props;
    this.doUpdate({ isInitial: true });

    if (updateInterval) {
      this.interval = setInterval(() => this.doUpdate({}), updateInterval);
    }
  }

  initWmsWorker = () => {
    if (!this.wmsWorkerRef.current) {
      this.wmsWorkerRef.current = wrap(
        new Worker(new URL("./wms-getcaps-worker.js", import.meta.url))
      );
    }
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getWMSTimestamps = async () => {
    const { layer } = this.props;

    const {
      id: layerId,
      getCapabilitiesUrl,
      layerName,
      autoUpdateInterval,
      getCapabilitiesLayerName,
    } = layer;

    this.initWmsWorker();

    if (this.wmsWorkerRef.current) {
      return await this.wmsWorkerRef.current.wmsGetLayerTimeFromCapabilities(
        getCapabilitiesUrl,
        getCapabilitiesLayerName || layerName
      );
    }
  };

  doUpdate = async ({ isInitial }) => {
    const {
      layer,
      getTimestamps,
      getData,
      setMapSettings,
      setTimestamps,
      getCurrentLayerTime,
      setGeojsonData,
      activeDatasets,
      setLayerUpdatingStatus,
      setLayerLoadingStatus,
      zoomToDataExtent,
    } = this.props;

    const { id: layerId, layerType } = layer;

    let getLayerTimestamps = getTimestamps;

    if (!getTimestamps && layerType === "wms") {
      getLayerTimestamps = this.getWMSTimestamps;
    }

    // update timestamps
    if (getLayerTimestamps) {
      console.log(`Updating layer : ${layerId}, fetching latest timestamps`);

      setLayerUpdatingStatus({ [layerId]: true });

      if (isInitial) {
        setLayerLoadingStatus({ [layerId]: true });
      }

      //
      getLayerTimestamps()
        .then((timestamps) => {
          // sort timestamps by date
          const sortedTimestamps =
            timestamps &&
            !!timestamps.length &&
            timestamps.sort((a, b) => parseISO(a) - parseISO(b));

          setTimestamps({ [layerId]: sortedTimestamps });

          const newParams = {
            time: sortedTimestamps[sortedTimestamps.length - 1],
          };

          if (getCurrentLayerTime) {
            const newTime = getCurrentLayerTime(sortedTimestamps);

            newParams.time = newTime;
          }

          const newDatasets = activeDatasets.map((l) => {
            const dataset = { ...l };
            if (l.layers.includes(layerId)) {
              dataset.params = {
                ...dataset.params,
                ...newParams,
              };
            }
            return dataset;
          });

          setMapSettings({
            datasets: newDatasets,
          });

          setLayerUpdatingStatus({ [layerId]: false });

          if (isInitial) {
            setLayerLoadingStatus({ [layerId]: false });
          }
        })
        .catch((err) => {
          setTimestamps({ [layerId]: [] });

          setLayerUpdatingStatus({ [layerId]: false });

          setLayerLoadingStatus({ [layerId]: false });
        });
    }

    // update data
    if (getData) {
      console.log(`Updating layer : ${layerId}, fetching latest data`);

      setLayerUpdatingStatus({ [layerId]: true });

      if (isInitial) {
        setLayerLoadingStatus({ [layerId]: true });
      }

      getData()
        .then((data) => {
          if (data) {
            setGeojsonData({ [layerId]: data });
            setLayerUpdatingStatus({ [layerId]: false });

            if (isInitial) {
              setLayerLoadingStatus({ [layerId]: false });
            }

            // zoom to data extents
            if (isInitial && zoomToDataExtent && !isEmpty(data.features)) {
              setMapSettings({ bbox: bbox(data), padding: 20 });
            }
          }
        })
        .catch((err) => {
          setLayerUpdatingStatus({ [layerId]: false });
          setLayerLoadingStatus({ [layerId]: false });
        });
    }
  };

  render() {
    return null;
  }
}

export default connect(getDatasetProps, actions)(LayerUpdate);
