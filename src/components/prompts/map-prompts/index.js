import { createElement, PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import reducerRegistry from "@/redux/registry";

import { setAnalysisSettings } from "@/components/analysis/actions";
import { setMenuSettings } from "@/components/map-menu/actions";
import { setMainMapSettings } from "@/layouts/map/actions";

import * as actions from "./actions";
import reducers, { initialState } from "./reducers";
import Component from "./component";
import { getMapPromptsProps } from "./selectors";

class MapPromptsContainer extends PureComponent {
  componentDidUpdate(prevProps) {
    const {
      mapZoom,
      setMapPromptsSettings,
      recentActive,
      showPrompts,
      activeCategories,
      datasetIds,
    } = this.props;
    const shouldOpenRecentImageryPrompt =
      showPrompts &&
      !recentActive &&
      // if map zooms past 9
      mapZoom > 9 &&
      prevProps.mapZoom <= 9;

    const shouldOpenAnalysisPrompt =
      showPrompts &&
      // if map zooms past 9
      mapZoom > 3 &&
      prevProps.mapZoom <= 3 &&
      activeCategories;

    if (shouldOpenAnalysisPrompt) {
      setMapPromptsSettings({
        open: true,
        stepsKey: "analyzeAnArea",
        stepIndex: 0,
      });
    }
  }

  getStepsData = () => {
    const { stepsKey } = this.props;
    const { setMapPromptsSettings, setAnalysisView, clearAnalysisView } =
      this.props;

    const allSteps = {
      mapTour: {
        title: "Map tour",
        steps: [
          {
            target: ".map-tour-data-layers",
            content: "Explore available data layers",
            disableBeacon: true,
            placement: "right",
            actions: {
              prev: () => {
                this.resetMapLayout();
              },
            },
          },
          {
            target: ".map-tour-legend",
            placement: "right",
            disableBeacon: true,
            content:
              'View and change settings for data layers on the map like date range and opacity. Click the "i" icons to learn more about a dataset.',
            actions: {
              next: () => {
                this.props.setMainMapSettings({
                  showAnalysis: true,
                });
              },
            },
          },
          {
            target: ".map-tour-menu-panel",
            placement: "right",
            disableBeacon: true,
            content:
              "Search for a dataset, location or geographic coordinates.",
            actions: {
              next: () => {
                this.props.setMenuSettings({
                  menuSection: "",
                });
                this.props.setMainMapSettings({
                  showBasemaps: true,
                });
              },
              prev: () => {
                this.props.setMenuSettings({
                  menuSection: "explore",
                });
              },
            },
          },
          {
            target: ".map-tour-basemaps",
            content:
              "Customize the basemap, including the boundaries displayed and the color of the labels.",
            disableBeacon: true,
            actions: {
              next: () => {
                this.props.setMainMapSettings({
                  showBasemaps: false,
                });
              },
              prev: () => {
                this.props.setMenuSettings({
                  menuSection: "search",
                });
                this.props.setMainMapSettings({
                  showBasemaps: false,
                });
              },
            },
          },
          {
            target: ".map-tour-map-controls",
            disableBeacon: true,
            content:
              "Access basic map tools: zoom out and in, expand the map, share or embed, print, and take a tour of the map. Also view zoom level and lat/long coordinates.",
          },
          {
            target: ".map-tour-main-menu",
            content: "Access the main navigation menu.",
            disableBeacon: true,
          },
        ],
      },
      analyzeAnArea: {
        title: "Analyze an Area of Interest",
        steps: [
          {
            target: ".c-data-analysis-menu",
            placement: "right",
            content:
              "Analyze data within your area of interest by clicking a shape on the map or drawing or uploading a shape.",
            disableBeacon: true,
            actions: {
              prev: () => {
                this.props.setMainMapSettings({
                  showAnalysis: true,
                });
                this.props.setAnalysisSettings({
                  showDraw: false,
                });
              },
              learnHow: () => {
                this.resetPrompts();
                setTimeout(() => {
                  setMapPromptsSettings({
                    open: true,
                    stepsKey: "analyzeAnAreaTour",
                    stepIndex: 0,
                    force: true,
                  });
                }, 100);
              },
            },
          },
        ],
        settings: {
          disableOverlay: true,
        },
      },
      analyzeAnAreaTour: {
        title: "Analyze an Area",
        steps: [
          {
            target: ".analysis-boundary-menu",
            content:
              "For a one click analysis, first choose your preferred map boundaries (political boundaries). Then click on a shape on the map and the analysis will be performed.",
            disableBeacon: true,
            placement: "right",
            actions: {
              returnToTour: () => {
                this.resetPrompts();
                setTimeout(() => {
                  this.props.setMapPromptsSettings({
                    open: true,
                    stepsKey: "mapTour",
                    stepIndex: 2,
                    force: true,
                  });
                }, 100);
              },
              prev: () => {
                this.props.setMainMapSettings({
                  showAnalysis: true,
                });
                this.props.setAnalysisSettings({
                  showDraw: false,
                });
              },
            },
          },
          {
            target: ".draw-upload-tab",
            content:
              "To draw a shape, click the Draw or Upload Shape tab and click Start Drawing. Click on the map, move the mouse, and click again until you form your desired shape. Once the shape is fully connected, the analysis will be performed.",
            disableBeacon: true,
            placement: "right",
            actions: {
              next: () => {
                this.props.setAnalysisSettings({
                  showDraw: true,
                });
              },
              prev: () => {
                this.props.setAnalysisSettings({
                  showDraw: false,
                });
              },
            },
          },
          {
            target: ".draw-menu-input",
            content:
              "To upload a shape, click Pick a File or Drop One Here and select your desired shapefile. Once uploaded, the shape will appear on the map and the analysis will be performed.",
            disableBeacon: true,
            placement: "right",
          },
        ],
      },
      areaOfInterestTour: {
        title: "Create an area of interest",
        steps: [
          {
            target: ".subnav-link-analysis",
            content:
              "Click the Analysis tab, where you can upload or draw or a custom shape on the map.",
            disableBeacon: true,
            placement: "right",
            actions: {
              prev: () => {
                this.props.setMainMapSettings({
                  showAnalysis: false,
                });
                this.props.setAnalysisSettings({
                  showDraw: false,
                });
                clearAnalysisView();
              },
              next: () => {
                this.props.setMainMapSettings({
                  showAnalysis: true,
                });
                this.props.setAnalysisSettings({
                  showDraw: false,
                });
              },
            },
          },
          {
            target: ".draw-upload-tab",
            content:
              "Zoom the map to your desired location and click this button to draw or upload a shape. An analysis will be automatically triggered after you finish.",
            disableBeacon: true,
            placement: "right",
            actions: {
              prev: () => {
                this.props.setAnalysisSettings({
                  showDraw: false,
                });
                this.props.setMainMapSettings({
                  showAnalysis: false,
                });
              },
            },
          },
          {
            target: ".analysis-boundary-menu",
            content:
              "Alternatively, you can click anywhere on the map to prompt an analysis on that area. You can analyze countries and regions (political boundaries). Let’s perform an analysis on a country, for example.",
            disableBeacon: true,
            placement: "right",
            delay: 3000,
            actions: {
              prev: () => {
                this.props.setMainMapSettings({
                  showAnalysis: true,
                });
                this.props.setAnalysisSettings({
                  showDraw: false,
                });
                clearAnalysisView();
              },
              next: () => {
                setAnalysisView({ type: "country", adm0: "KEN" });
              },
            },
          },
          {
            target: ".analysis-actions",
            delay: 600,
            content:
              "After you perform an analysis on any area, click on the Save in my HW button to save the area for future reference.",
            disableBeacon: true,
            placement: "right",
            prev: () => {
              clearAnalysisView();
            },
          },
        ],
      },
      subscribeToArea: {
        title: "Subscribe to alerts",
        steps: [
          {
            target: ".subscribe-btn",
            content:
              "Did you know you can subscribe to receive email updates when new data is available for an area?",
            disableBeacon: true,
            placement: "right",
          },
        ],
        settings: {
          disableOverlay: true,
        },
      },
    };

    return allSteps[stepsKey];
  };

  resetMapLayout = () => {
    this.props.setMainMapSettings({
      showAnalysis: false,
      showRecentImagery: false,
    });
    this.props.setMenuSettings({ menuSection: "" });
  };

  resetPrompts = () => {
    this.props.setMapPromptsSettings({
      open: false,
      stepIndex: 0,
      stepsKey: "",
      force: true,
    });
  };

  handleShowPrompts = (showPrompts) => {
    this.props.setShowMapPrompts(showPrompts);
  };

  render() {
    return createElement(Component, {
      ...this.props,
      data: this.getStepsData(),
      handleShowPrompts: this.handleShowPrompts,
    });
  }
}

MapPromptsContainer.propTypes = {
  setMainMapSettings: PropTypes.func,
  setMenuSettings: PropTypes.func,
  setMapPromptsSettings: PropTypes.func,
  setAnalysisSettings: PropTypes.func,
  setShowMapPrompts: PropTypes.func,
  stepsKey: PropTypes.string,
  mapZoom: PropTypes.number,
  recentActive: PropTypes.bool,
  showPrompts: PropTypes.bool,
  activeCategories: PropTypes.array,
  datasetIds: PropTypes.array,
  setAnalysisView: PropTypes.func,
  clearAnalysisView: PropTypes.func,
};

reducerRegistry.registerModule("mapPrompts", {
  actions,
  reducers,
  initialState,
});

export default connect(getMapPromptsProps, {
  ...actions,
  setMainMapSettings,
  setMenuSettings,
  setAnalysisSettings,
})(MapPromptsContainer);
