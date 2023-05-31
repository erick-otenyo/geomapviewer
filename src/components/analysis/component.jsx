import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import ChoseAnalysis from "@/components/analysis/components/chose-analysis";
import ShowAnalysis from "@/components/analysis/components/show-analysis";

import "./styles.scss";

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
        </div>
      </Fragment>
    );
  }
}

export default AnalysisComponent;
