import { PureComponent } from "react";
import bbox from "@turf/bbox";
import { isEmpty, isEqual } from "lodash";
import { connect } from "react-redux";

import * as ownActions from "./actions";
import { getDatasetProps } from "./selectors";
import { setMapSettings } from "@/components/map/actions";

const actions = {
  ...ownActions,
  setMapSettings,
};

class LayerUpdate extends PureComponent {
  componentDidMount() {
    const { updateInterval } = this.props;
    this.doUpdate({ isInitial: true });

    if (updateInterval) {
      this.interval = setInterval(() => this.doUpdate({}), updateInterval);
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  doUpdate = ({ isInitial }) => {
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

    // update timestamps
    if (getTimestamps) {
      console.log(`Updating layer : ${layer}, fetching latest timestamps`);

      setLayerUpdatingStatus({ [layer]: true });

      if (isInitial) {
        setLayerLoadingStatus({ [layer]: true });
      }

      getTimestamps()
        .then((timestamps) => {
          setTimestamps({ [layer]: timestamps });

          const newParams = { time: timestamps[timestamps.length - 1] };

          if (getCurrentLayerTime) {
            const newTime = getCurrentLayerTime(timestamps);

            newParams.time = newTime;
          }

          const newDatasets = activeDatasets.map((l) => {
            const dataset = { ...l };
            if (l.layers.includes(layer)) {
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

          setLayerUpdatingStatus({ [layer]: false });

          if (isInitial) {
            setLayerLoadingStatus({ [layer]: false });
          }
        })
        .catch((err) => {
          setLayerUpdatingStatus({ [layer]: false });

          setLayerLoadingStatus({ [layer]: false });
        });
    }

    // update data
    if (getData) {
      console.log(`Updating layer : ${layer}, fetching latest data`);

      setLayerUpdatingStatus({ [layer]: true });

      if (isInitial) {
        setLayerLoadingStatus({ [layer]: true });
      }

      getData()
        .then((data) => {
          if (data) {
            setGeojsonData({ [layer]: data });
            setLayerUpdatingStatus({ [layer]: false });

            if (isInitial) {
              setLayerLoadingStatus({ [layer]: false });
            }

            // zoom to data extents
            if (isInitial && zoomToDataExtent && !isEmpty(data.features)) {
              setMapSettings({ bbox: bbox(data), padding: 20 });
            }
          }
        })
        .catch((err) => {
          setLayerUpdatingStatus({ [layer]: false });
          setLayerLoadingStatus({ [layer]: false });
        });
    }
  };

  render() {
    return null;
  }
}

export default connect(getDatasetProps, actions)(LayerUpdate);
