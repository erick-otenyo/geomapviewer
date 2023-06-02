import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import ChoseAnalysis from "@/components/analysis/components/chose-analysis";
import ShowAnalysis from "@/components/analysis/components/show-analysis";

import "./styles.scss";

const isServer = typeof window === "undefined";

class AnalysisComponent extends PureComponent {
  static propTypes = {
    clearAnalysis: PropTypes.func,
    className: PropTypes.string,
    endpoints: PropTypes.array,
    widgetLayers: PropTypes.array,
    loading: PropTypes.bool,
    location: PropTypes.object,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    geostoreError: PropTypes.bool,
    handleCancelAnalysis: PropTypes.func,
    handleFetchAnalysis: PropTypes.func,
    embed: PropTypes.bool,
    search: PropTypes.string,
    setShareModal: PropTypes.func,
    checkingShape: PropTypes.bool,
    areaTooLarge: PropTypes.bool,
    uploadingShape: PropTypes.bool,
    activeArea: PropTypes.object,
    areaTooLarge: PropTypes.bool,
    setAreaOfInterestModalSettings: PropTypes.func,
  };

  render() {
    const {
      className,
      loading,
      checkingShape,
      uploadingShape,
      location,
      clearAnalysis,
      goToDashboard,
      error,
      geostoreError,
      handleCancelAnalysis,
      handleFetchAnalysis,
      endpoints,
      widgetLayers,
      activeArea,
      areaTooLarge,
      setAreaOfInterestModalSettings,
      setShareModal,
    } = this.props;

    const hasLayers = endpoints && !!endpoints.length;
    const hasWidgetLayers = widgetLayers && !!widgetLayers.length;

    return (
      <Fragment>
        <div className={cx("c-analysis", className)}>
          {loading && (
            <Loader className={cx("analysis-loader", { fetching: loading })} />
          )}
          {location.type &&
            location.adm0 != undefined &&
            (loading || (!loading && error)) && (
              <div className={cx("cancel-analysis", { fetching: loading })}>
                {!loading && error && !geostoreError && (
                  <Button
                    className="refresh-analysis-btn"
                    onClick={() => handleFetchAnalysis(endpoints)}
                  >
                    REFRESH ANALYSIS
                  </Button>
                )}
                <Button
                  className="cancel-analysis-btn"
                  onClick={handleCancelAnalysis}
                >
                  CANCEL ANALYSIS
                </Button>
                {!loading && error && (
                  <p className="error-message">
                    {geostoreError
                      ? "We are having trouble getting the selected geometry. Please try again later."
                      : error}
                  </p>
                )}
              </div>
            )}
          {location.type && location.adm0 != undefined && !error && (
            <ShowAnalysis
              clearAnalysis={clearAnalysis}
              goToDashboard={goToDashboard}
              hasLayers={hasLayers}
              hasWidgetLayers={hasWidgetLayers}
              analysis
            />
          )}
          {!location.adm0 && (
            <ChoseAnalysis
              checkingShape={checkingShape}
              uploadingShape={uploadingShape}
              handleCancelAnalysis={handleCancelAnalysis}
            />
          )}
          {!loading &&
            !error &&
            location &&
            location.type &&
            location.adm0 != undefined && (
              <div className="analysis-actions">
                {/* {location.type === "country" && !location.areaId && (
                <Button
                  className="analysis-action-btn"
                  theme="theme-button-light"
                  {...linkProps}
                  onClick={() =>
                    trackEvent({
                      category: "Map analysis",
                      action: "User goes to dashboards",
                      label: location.adm0,
                    })
                  }
                >
                  DASHBOARD
                </Button>
              )}
              {activeArea && (
                <Button
                  className="analysis-action-btn"
                  theme="theme-button-light"
                  link={activeArea && `/dashboards/aoi/${activeArea.id}`}
                  tooltip={{ text: "Go to Areas of Interest dashboard" }}
                >
                  DASHBOARD
                </Button>
              )} */}
                {location.type !== "point" &&
                  (!activeArea || (activeArea && !activeArea.userArea)) && (
                    <Button
                      className="analysis-action-btn save-to-myhw-btn"
                      onClick={() => setAreaOfInterestModalSettings(true)}
                      disabled={areaTooLarge}
                      {...(areaTooLarge && {
                        tooltip: {
                          text: "Your area is too large! Please try again with an area smaller than 1 billion hectares (approximately the size of Brazil).",
                        },
                      })}
                    >
                      save area
                    </Button>
                  )}
                {activeArea && activeArea.userArea && (
                  <Button
                    className="analysis-action-btn"
                    onClick={() =>
                      setShareModal({
                        title: "Share this view",
                        shareUrl:
                          !isServer &&
                          (window.location.href.includes("embed")
                            ? window.location.href.replace("/embed", "")
                            : window.location.href),
                        areaId: activeArea?.id,
                      })
                    }
                    tooltip={{ text: "Share this area" }}
                  >
                    Share area
                  </Button>
                )}
              </div>
            )}
        </div>
      </Fragment>
    );
  }
}

export default AnalysisComponent;
