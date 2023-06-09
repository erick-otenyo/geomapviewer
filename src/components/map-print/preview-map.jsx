import React, { Component } from "react";
import PropTypes from "prop-types";

import Loader from "@/components/ui/loader";
import Map from "@/components/ui/map";
import Scale from "@/components/map/components/scale";
import Button from "@/components/ui/button";
import Icon from "@/components/ui/icon";

import plusIcon from "@/assets/icons/plus.svg?sprite";
import minusIcon from "@/assets/icons/minus.svg?sprite";

class MapPreview extends Component {
  state = { mapLoaded: false, viewport: this.props.viewport };

  onLoad = (map) => {
    const { onLoad } = this.props;

    this.setState({ mapLoaded: true });

    if (onLoad) {
      onLoad(map);
    }
  };

  onViewportChange = (v) => {
    this.setState({ viewport: v });
  };

  zoomIn = () => {
    const { viewport } = this.state;
    const { zoom, maxZoom } = this.state;
    const newZoom = zoom + 1 > maxZoom ? maxZoom : zoom + 1;
    // this.setState({ viewport: { ...viewport, zoom: newZoom } });
  };

  zoomOut = () => {
    const { viewport } = this.state;
    const { zoom, minZoom } = this.state;

    const newZoom = zoom - 1 < minZoom ? minZoom : zoom - 1;
    // this.setState({ viewport: { ...viewport, zoom: newZoom } });
  };

  render() {
    const { mapStyle } = this.props;
    const { mapLoaded, viewport } = this.state;

    const { minZoom, zoom, maxZoom } = viewport;

    return (
      <div className="map-print-preview">
        {!mapLoaded && <Loader className="map-loader" />}
        {mapStyle && (
          <Map
            mapStyle={mapStyle}
            viewport={viewport}
            onLoad={this.onLoad}
            attributionControl={false}
            preserveDrawingBuffer={true}
            onViewportChange={this.onViewportChange}
            // dragPan={false}
            scrollZoom={false}
          >
            {(map) => (
              <>
                {/* ZOOM CONTROLS */}
                <div className="zoom-controls">
                  <Button
                    className="map-control"
                    theme="theme-button-map-control"
                    // onClick={() => map.zoomIn()}
                    tooltip={{ text: "Zoom in" }}
                    disabled={zoom >= maxZoom}
                  >
                    <Icon icon={plusIcon} className="plus-icon" />
                  </Button>
                  <Button
                    className="map-control"
                    theme="theme-button-map-control"
                    // onClick={() => map.zoomOut()}
                    tooltip={{ text: "Zoom out" }}
                    disabled={zoom <= minZoom}
                  >
                    <Icon icon={minusIcon} className="minus-icon" />
                  </Button>
                </div>

                {/* SCALE */}
                <Scale className="map-scale" map={map} viewport={viewport} />
              </>
            )}
          </Map>
        )}
      </div>
    );
  }
}

MapPreview.propTypes = {
  mapStyle: PropTypes.object,
  viewport: PropTypes.object,
  onLoad: PropTypes.func,
};

export default MapPreview;
