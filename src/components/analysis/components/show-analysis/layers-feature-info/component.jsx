import React, { PureComponent } from "react";
import isEqual from "lodash/isEqual";
import isInteger from "lodash/isInteger";
import isNumber from "lodash/isNumber";
import { format as dateFormat, parseISO } from "date-fns";

import Icon from "@/components/ui/icon";
import Loader from "@/components/ui/loader";
import {
  fetchRasterPixelValue,
  fetchRasterGeostoreValue,
} from "@/services/analysis";
import layersIcon from "@/assets/icons/layers.svg?sprite";
import infoIcon from "@/assets/icons/info-fill.svg?sprite";
import calendarIcon from "@/assets/icons/calendar.svg?sprite";

import "./styles.scss";

class FeatureInfo extends PureComponent {
  state = {
    value: null,
    loading: false,
  };

  componentDidMount() {
    this.fetchValue();
  }

  componentDidUpdate(prevProps) {
    const { location, layer, geostore } = this.props;

    const {
      location: prevLocation,
      layer: prevLayer,
      geostore: prevGeostore,
    } = prevProps;

    const shouldUpdate =
      !isEqual(location, prevLocation) ||
      !isEqual(layer, prevLayer) ||
      !isEqual(geostore, prevGeostore);

    if (shouldUpdate) {
      this.fetchValue();
    }
  }

  fetchValue = () => {
    const { layer, config, location, geostore } = this.props;

    const { type: locationType, adm0, adm1 } = location;

    if (locationType === "point") {
      const lat = parseFloat(adm0);
      const lng = parseFloat(adm1);

      const args = {
        layerId: layer.id,
        time: layer.params.time,
        lat: lat,
        lng: lng,
      };

      const allArgsAvailable = Object.values(args).every(
        (value) => value !== undefined && value !== null && value !== ""
      );

      if (allArgsAvailable) {
        this.setState({ loading: true });
        fetchRasterPixelValue(args).then((value) => {
          this.setState({ value: value, loading: false });
        });
      }
    } else {
      const adminLocationTypes = ["country", "geostore", "aoi"];

      if (
        adminLocationTypes.includes(locationType) &&
        geostore &&
        geostore.id
      ) {
        const args = {
          layerId: layer.id,
          time: layer.params.time,
          geostoreId: geostore.id,
          valueType: config.valueType,
        };

        const allArgsAvailable = Object.values(args).every(
          (value) => value !== undefined && value !== null && value !== ""
        );

        if (allArgsAvailable) {
          this.setState({ loading: true });

          fetchRasterGeostoreValue(args).then((data) => {
            this.setState({ value: data, loading: false });
          });
        }
      }
    }
  };

  formatValue = (value) => {
    const { config } = this.props;
    const { unit } = config;

    let fValue = "";

    if (isInteger(value)) {
      fValue = value;
    }

    if (isNumber(value)) {
      fValue = value.toFixed(2);
    }

    return `${fValue} ${unit}`;
  };

  getValues = () => {
    const { config } = this.props;
    const { value } = this.state;
    const { valueType } = config;

    const values = [];

    if (valueType) {
      if (valueType === "mean") {
        if (value.mean !== undefined) {
          values.push({ label: "Mean", value: this.formatValue(value.mean) });
        }

        return values;
      }

      if (valueType === "sum") {
        if (value.sum !== undefined) {
          values.push({ label: "Sum", value: this.formatValue(value.sum) });
        }

        return values;
      }

      if (valueType === "minmax") {
        if (value.min !== undefined) {
          values.push({ label: "Minimum", value: this.formatValue(value.min) });
        }

        if (value.max !== undefined) {
          values.push({
            label: "Maximum",
            value: this.formatValue(value.max),
          });
        }

        return values;
      }

      if (valueType === "minmeanmax") {
        if (value.min !== undefined) {
          values.push({ label: "Minimum", value: this.formatValue(value.min) });
        }

        if (value.mean !== undefined) {
          values.push({
            label: "Mean",
            value: this.formatValue(value.mean),
          });
        }

        if (value.max !== undefined) {
          values.push({
            label: "Maximum",
            value: this.formatValue(value.max),
          });
        }

        return values;
      }
    }

    values.push({
      label: "Value",
      value: this.formatValue(value),
    });

    return values;
  };

  render() {
    const { layer } = this.props;
    const { value, loading } = this.state;

    const { params } = layer;

    return (
      <div className="feature-info">
        <h3 className="feature-info-layer">
          <Icon className="layer-icon" icon={layersIcon} />
          <span>{layer.name}</span>
        </h3>

        {loading && <Loader className="info-loader" />}

        {value != null && (
          <div className="feature-info-items">
            {params.time && (
              <div className="info-item date">
                <span className="label">
                  <Icon className="layer-icon" icon={calendarIcon} />
                  <span>Date: </span>
                </span>
                <span className="val">
                  {dateFormat(parseISO(params.time), "yyyy-MM-dd HH:mm")}
                </span>
              </div>
            )}
            {this.getValues().map((val) => (
              <div key={val.label} className="info-item">
                <span className="label">
                  <Icon className="layer-icon" icon={infoIcon} />
                  <span>{val.label}: </span>
                </span>
                <span className="val">{val.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

class LayersFeatureInfo extends PureComponent {
  render() {
    const { layers, location, geostore } = this.props;

    const { type: locationType } = location;

    const adminLocationTypes = ["country", "geostore", "aoi"];

    const items = layers.reduce((all, layer) => {
      const config =
        locationType === "point"
          ? layer.analysisConfig.pointInstanceAnalysis
          : layer.analysisConfig.areaInstanceAnalysis;

      if (config) {
        const viz = (
          <FeatureInfo
            key={layer.id}
            layer={layer}
            config={config}
            location={location}
            geostore={geostore}
          />
        );

        all.push(viz);
      }

      return all;
    }, []);

    return <div>{items}</div>;
  }
}

export default LayersFeatureInfo;
