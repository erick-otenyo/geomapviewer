import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import MapLegend from "@/components/map/components/legend";
// import SatelliteBasemaps from '@/components/satellite-basemaps';
import Analysis from "@/components/analysis";
import SubNavMenu from "@/components/subnav-menu";
import CompareControls from "@/components/map/components/compare/components/compare-controls";

import "./styles.scss";

class DataAnalysisMenu extends PureComponent {
  static propTypes = {
    showAnalysis: PropTypes.bool,
    hidden: PropTypes.bool,
    className: PropTypes.string,
    menuSection: PropTypes.object,
    links: PropTypes.array,
    setMainMapSettings: PropTypes.func,
    setMapSettings: PropTypes.func,
    clearAnalysisError: PropTypes.func,
    clearAnalysis: PropTypes.func,
    embed: PropTypes.bool,
  };

  getLinks = () => {
    const {
      links,
      clearAnalysisError,
      setMainMapSettings,
      setMapSettings,
      showAnalysis,
      hidden,
    } = this.props;

    return links.map((l) => ({
      ...l,
      onClick: () => {
        setMainMapSettings({
          showAnalysis: l.showAnalysis,
          hideLegend:
            (showAnalysis && l.active && !hidden) ||
            (!showAnalysis && l.active && !hidden),
        });
        setMapSettings({ drawing: false });
        clearAnalysisError();
      },
    }));
  };

  render() {
    const {
      className,
      showAnalysis,
      menuSection,
      hidden,
      embed,
      setMapSettings,
      comparing,
      clearAnalysis,
    } = this.props;

    return (
      <div
        className={cx(
          "c-data-analysis-menu",
          "map-tour-legend",
          { relocate: !!menuSection && menuSection.Component },
          { big: menuSection && menuSection.large },
          { embed },
          className
        )}
      >
        <SubNavMenu
          className="nav"
          theme="theme-subnav-plain"
          links={this.getLinks()}
          checkActive
        />
        {!hidden && !showAnalysis && <MapLegend className="map-legend" />}
        {!hidden && !showAnalysis && (
          <CompareControls
            className="map-compare-control"
            active={comparing}
            onChange={() => {
              if (!comparing) {
                clearAnalysis({ isComparing: true });
              }

              setMapSettings({
                comparing: !comparing,
                activeCompareSide: !comparing ? "left" : null,
              });
            }}
          />
        )}
        {!hidden && showAnalysis && <Analysis className="map-analysis" />}
      </div>
    );
  }
}

export default DataAnalysisMenu;
