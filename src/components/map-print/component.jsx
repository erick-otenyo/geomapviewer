import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ReactToPrint from "react-to-print";
import WebMercatorViewport from "viewport-mercator-project";
import { Row, Column } from "@erick-otenyo/hw-components";
import isEmpty from "lodash/isEmpty";

import LegendItemTypes from "@/components/map/components/legend/components/legend-item-types";
import Checkbox from "@/components/ui/checkbox";
import Button from "@/components/ui/button";
import MapPreview from "./preview-map";

import geomapviewerLogo from "@/assets/logos/geomapviewer.png?webp";

import "./styles.scss";

class MapPrint extends PureComponent {
  state = { previewMapLoaded: false, mounted: false, title: false };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  onMapPreviewLoad = (map) => {
    this.setState({ previewMapLoaded: true });
  };

  handleOnOptionToggle = (option) => {
    this.setState({ [option]: !this.state[option] });
  };

  renderLegendItems = () => {
    const { activeLayers } = this.props;

    return (
      activeLayers &&
      !!activeLayers.length &&
      activeLayers.map((layer) => {
        if (layer && (!isEmpty(layer.legendConfig) || layer.legendImage)) {
          return (
            <Column className="layer-legend" width={[1 / 2]}>
              <div className="layer-title">{layer.name}</div>
              {layer.legendImage && layer.legendImage.url ? (
                <div className="legend-image">
                  <img src={layer.legendImage.url} />
                </div>
              ) : (
                <LegendItemTypes activeLayer={layer} />
              )}
            </Column>
          );
        }

        return null;
      })
    );
  };

  render() {
    const { onCancel, mapPrintConfig, activeLayers, logo } = this.props;
    const { mapStyle, viewport, bounds } = mapPrintConfig || {};
    const { previewMapLoaded, mounted, title } = this.state;

    let mapViewport = { ...viewport } || {};

    if (mounted && mapStyle && viewport && bounds) {
      const v = {
        width: this.mapContainer.offsetWidth,
        height: this.mapContainer.offsetHeight,
        ...viewport,
      };

      // try to fit parent mapstyle to new size
      const { longitude, latitude, zoom } =
        new WebMercatorViewport(v)?.fitBounds(bounds) || {};

      mapViewport = { ...viewport, longitude, latitude, zoom };
    }

    const hasLayers =
      activeLayers &&
      activeLayers.find((l) => !isEmpty(l.legendConfig) || l.legendImage);

    return (
      <section
        className="c-print-preview"
        ref={(el) => (this.printComponentRef = el)}
      >
        <div className="report">
          <div className="full-height">
            <div className="report-controls">
              <div className="r-control">
                <Checkbox
                  id="title"
                  value={Boolean(title)}
                  onChange={() => {
                    this.handleOnOptionToggle("title");
                  }}
                />
                <label htmlFor="title">Add Map Title</label>
              </div>
            </div>
            <div className="report-body">
              <div className="page-header">
                <div className="brand">
                  <img
                    className="logo"
                    src={logo || geomapviewerLogo}
                    alt="Brand Logo"
                  />
                </div>
                {title && (
                  <h1 className="report-title" contentEditable>
                    Click To Edit Map Title
                  </h1>
                )}
              </div>
              <div
                className="print-map"
                ref={(r) => {
                  this.mapContainer = r;
                }}
              >
                {mounted && (
                  <MapPreview
                    mapStyle={mapStyle}
                    viewport={mapViewport}
                    onLoad={this.onMapPreviewLoad}
                  />
                )}
              </div>
              <div className="report-content">
                <div className="map-legend-container">
                  {hasLayers && (
                    <>
                      <div className="legend-container-header">Map Layers</div>
                      <Row className="map-legend">
                        {this.renderLegendItems()}
                      </Row>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="print-config">
          <div className="container">
            <div className="print-controls">
              <Button
                className="print-ctrl cancel-btn"
                theme="theme-button-light"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <ReactToPrint
                trigger={() => {
                  return (
                    <Button
                      className="print-ctrl print-btn"
                      disabled={!previewMapLoaded}
                    >
                      Print
                    </Button>
                  );
                }}
                content={() => this.printComponentRef}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

MapPrint.propTypes = {
  onCancel: PropTypes.func,
  mapPrintConfig: PropTypes.object,
  activeLayers: PropTypes.array,
};

MapPrint.defaultProps = {
  onCancel: () => ({}),
};

export default MapPrint;
