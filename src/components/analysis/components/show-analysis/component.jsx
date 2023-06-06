import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import Icon from "@/components/ui/icon";
import NoContent from "@/components/ui/no-content";
import Button from "@/components/ui/button";
import Widgets from "@/components/widgets";
import DynamicSentence from "@/components/ui/dynamic-sentence";
import LayersFeatureInfo from "./layers-feature-info";

import arrowDownIcon from "@/assets/icons/arrow-down.svg?sprite";
import shareIcon from "@/assets/icons/share.svg?sprite";

import "./styles.scss";

const isServer = typeof window === "undefined";

class ShowAnalysis extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    setShareModal: PropTypes.func,
    clearAnalysis: PropTypes.func,
    loading: PropTypes.bool,
    error: PropTypes.string,
    analysisTitle: PropTypes.object,
    analysisDescription: PropTypes.object,
    handleShowDownloads: PropTypes.func,
    setMenuSettings: PropTypes.func,
    showDownloads: PropTypes.bool,
    hasLayers: PropTypes.bool,
    widgetLayers: PropTypes.array,
    downloadUrls: PropTypes.array,
    zoomLevel: PropTypes.number,
    showAnalysisDisclaimer: PropTypes.bool,
    location: PropTypes.object,
    geostore: PropTypes.object,
  };

  state = {
    disclaimerModalOpen: false,
  };

  render() {
    const {
      setShareModal,
      clearAnalysis,
      data,
      loading,
      error,
      hasLayers,
      widgetLayers,
      zoomLevel,
      analysisTitle,
      analysisDescription,
      layers,
      location,
      geostore,
    } = this.props;

    const hasWidgets = widgetLayers && !!widgetLayers.length;

    const adminLocationTypes = ["country", "geostore", "aoi"];

    const { type: locationType } = location;

    const layersWithFeatureInfoAnalysis = layers.filter(
      (l) =>
        l.analysisConfig &&
        (l.analysisConfig.pointInstanceAnalysis ||
          l.analysisConfig.areaInstanceAnalysis)
    );

    const hasLayersWithFeatureInfo =
      layersWithFeatureInfoAnalysis && !!layersWithFeatureInfoAnalysis.length;

    const hasAnalysisLayers = hasLayers || hasLayersWithFeatureInfo;

    return (
      <div className="c-show-analysis">
        <div className="show-analysis-body">
          {analysisTitle && !loading && !error && (
            <div className="draw-title">
              <Button
                className="title-btn left"
                theme="theme-button-clear"
                onClick={clearAnalysis}
              >
                <Icon icon={arrowDownIcon} className="icon-arrow" />
                {analysisTitle && (
                  <DynamicSentence
                    className="analysis-title"
                    sentence={analysisTitle}
                  />
                )}
              </Button>
              <div className="title-controls">
                <Button
                  className="title-btn title-action"
                  theme="theme-button-clear"
                  onClick={() =>
                    setShareModal({
                      title: "Share this view",
                      shareUrl:
                        !isServer &&
                        (window.location.href.includes("embed")
                          ? window.location.href.replace("/embed", "")
                          : window.location.href),
                    })
                  }
                  tooltip={{ text: "Share analysis" }}
                >
                  <Icon icon={shareIcon} className="icon-share" />
                </Button>
              </div>
            </div>
          )}
          {analysisDescription && !loading && !error && (
            <DynamicSentence
              className="analysis-desc"
              sentence={analysisDescription}
            />
          )}

          <div className="results">
            {hasAnalysisLayers &&
              !hasLayersWithFeatureInfo &&
              !hasWidgets &&
              !loading &&
              !error &&
              isEmpty(data) && (
                <NoContent message="No analysis data available" />
              )}

            {hasLayersWithFeatureInfo && (
              <LayersFeatureInfo
                location={location}
                layers={layersWithFeatureInfoAnalysis}
                geostore={geostore}
              />
            )}

            {!hasAnalysisLayers && !hasWidgets && !loading && (
              <NoContent>Select a data layer to analyze.</NoContent>
            )}

            {(hasAnalysisLayers || hasWidgets) && !loading && !error && (
              <Fragment>
                <Widgets simple analysis />
                <div className="disclaimers">
                  {zoomLevel < 11 && (
                    <p>
                      The results are approximated by sampling the selected
                      area. Results are more accurate at closer zoom levels.
                    </p>
                  )}
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ShowAnalysis;
