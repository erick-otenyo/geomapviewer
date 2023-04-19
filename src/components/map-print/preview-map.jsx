import React, { Component } from "react";
import PropTypes from "prop-types";

import Loader from "@/components/ui/loader";
import Map from "@/components/ui/map";

class MapPreview extends Component {
  state = { mapLoaded: false };

  onLoad = (map) => {
    const { onLoad } = this.props;

    this.setState({ mapLoaded: true });

    if (onLoad) {
      onLoad(map);
    }
  };

  render() {
    const { mapStyle, viewport } = this.props;
    const { mapLoaded } = this.state;

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
            // dragPan={false}
            scrollZoom={false}
          />
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
