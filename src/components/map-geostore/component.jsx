import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import cx from "classnames";
import ContentLoader from "react-content-loader";
import WebMercatorViewport from "viewport-mercator-project";
import { TRANSITION_EVENTS } from "react-map-gl";

import { PluginMapboxGl } from "layer-manager";
import { LayerManager, Layer } from "layer-manager/dist/components";

import { getGeostore } from "@/services/geostore";

import Map from "@/components/ui/map";

import BASEMAPS from "@/components/map/basemaps-sample";

import "./styles.scss";

const DEFAULT_VIEWPORT = {
  zoom: 2,
  lat: 0,
  lng: 0,
};

const { satellite } = BASEMAPS;

const basemap = {
  ...satellite,
};

class MapGeostore extends Component {
  static propTypes = {
    className: PropTypes.string,
    padding: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    cursor: PropTypes.string,
    small: PropTypes.bool,
    location: PropTypes.object,
  };

  static defaultProps = {
    padding: 25,
    height: 140,
    width: 140,
    cursor: "default",
  };

  state = {
    loading: true,
    error: false,
    viewport: DEFAULT_VIEWPORT,
    geostore: null,
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;
    const { location } = this.props;
    if (location && location.adm0) {
      this.handleGetGeostore();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { location } = this.props;
    const { location: prevLocation } = prevProps;

    if (location && !isEqual(location, prevLocation)) {
      this.handleGetGeostore();
    }

    const { geostore } = this.state;
    const { geostore: prevGeostore } = prevState;

    if (!isEmpty(geostore) && !isEqual(geostore, prevGeostore)) {
      this.fitBounds();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleGetGeostore = async () => {
    if (this.mounted) {
      this.setState({ error: false });
      try {
        if (this.mounted) {
          const geostore = await getGeostore(this.props.location);
          this.setState({ geostore });
        }
      } catch (error) {
        if (this.mounted) {
          this.setState({ error: true });
        }
      }
    }
  };

  onLoad = ({ map }) => {
    if (map) {
      map.on("render", () => {
        if (this.state.loading) {
          if (map.areTilesLoaded() && this.mounted) {
            this.setState({ loading: false });
          }
        } else {
          map.off("render");
        }
      });
    }
  };

  fitBounds = () => {
    const { viewport, geostore } = this.state;
    const { bbox } = geostore;

    const v = {
      width: this.mapContainer.offsetWidth,
      height: this.mapContainer.offsetHeight,
      ...viewport,
    };

    const { longitude, latitude, zoom } =
      new WebMercatorViewport(v)?.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        { padding: this.props.padding }
      ) || {};

    if (this.mounted) {
      this.setState({
        viewport: {
          ...this.state.viewport,
          longitude,
          latitude,
          zoom,
          transitionDuration: 0,
          transitionInterruption: TRANSITION_EVENTS.UPDATE,
        },
      });
    }
  };

  render() {
    const { className, width, height, cursor, small } = this.props;
    const { loading, viewport, geostore, error } = this.state;

    return (
      <div
        id="recent-image-map"
        className={cx("c-recent-image-map", className, { small })}
        ref={(r) => {
          this.mapContainer = r;
        }}
      >
        {loading && (
          <ContentLoader
            width={width}
            height={height}
            style={{ width: "100%" }}
          >
            <rect x="0" y="0" width={width} height="100%" />
          </ContentLoader>
        )}
        {error && !loading && (
          <p className="error-msg">we had trouble finding a recent image</p>
        )}
        {basemap && (
          <Map
            mapStyle={basemap.mapStyle}
            viewport={viewport}
            attributionControl={false}
            onLoad={this.onLoad}
            dragPan={false}
            dragRotate={false}
            scrollZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            touchRotate={false}
            keyboard={false}
            getCursor={() => cursor}
          >
            {(map) => (
              <LayerManager map={map} plugin={PluginMapboxGl}>
                {geostore && (
                  <Layer
                    id={geostore.id}
                    name="Geojson"
                    type="geojson"
                    source={{
                      data: geostore.geojson,
                      type: "geojson",
                    }}
                    render={{
                      layers: [
                        {
                          type: "fill",
                          paint: {
                            "fill-color": "transparent",
                          },
                        },
                        {
                          type: "line",
                          paint: {
                            "line-color": "#C0FF24",
                            "line-width": 3,
                            "line-offset": 2,
                          },
                        },
                        {
                          type: "line",
                          paint: {
                            "line-color": "#000",
                            "line-width": 2,
                          },
                        },
                      ],
                    }}
                    zIndex={1060}
                  />
                )}
                <Layer
                  key={basemap.url}
                  id={basemap.url}
                  name="Basemap"
                  type="raster"
                  source={{
                    type: "raster",
                    tiles: [basemap.url],
                  }}
                  zIndex={100}
                />
              </LayerManager>
            )}
          </Map>
        )}
      </div>
    );
  }
}

export default MapGeostore;
