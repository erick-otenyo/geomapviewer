import { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Dropdown from "@/components/ui/dropdown";

import {
  Row,
  Column,
  Button,
  Mobile,
  Desktop,
} from "@erick-otenyo/hw-components";

import Icon from "@/components/ui/icon";
import Toggle from "@/components/ui/toggle";

import infoIcon from "@/assets/icons/info.svg?sprite";
import closeIcon from "@/assets/icons/close.svg?sprite";
import boundariesIcon from "@/assets/icons/boundaries.svg?sprite";
import labelsIcon from "@/assets/icons/labels.svg?sprite";
import roadsIcon from "@/assets/icons/roads.svg?sprite";

import BasemapsMenu from "./basemaps-menu";

import "./styles.scss";

const Basemaps = ({
  className,
  labelSelected,
  activeBasemap,
  getTooltipContentProps,
  activeBoundaries,
  selectBoundaries,
  boundaries,
  selectLabels,
  labels,
  isDesktop,
  roadsSelected,
  selectRoads,
  roads,
  basemaps,
  setModalMetaSettings,
  selectBasemap,
  onClose,
  setMapSettings,
  clipToGeostore,
}) => {
  const [showBasemaps, setShowBasemaps] = useState(false);
  const selectedBoundaries = activeBoundaries
    ? { label: activeBoundaries.name }
    : boundaries?.[0];

  return (
    <div
      className={cx("c-basemaps", "map-tour-basemaps", className)}
      {...getTooltipContentProps()}
    >
      <Row>
        <Column>
          <div className="map-settings-header">
            <h4>Map settings</h4>
            <div className="header-actions">
              <Button
                className="info-btn"
                size="small"
                dark
                round
                onClick={() => setModalMetaSettings("flagship_basemaps")}
              >
                <Icon icon={infoIcon} />
              </Button>
              <Desktop>
                <button className="close-btn" onClick={onClose}>
                  <Icon icon={closeIcon} />
                </button>
              </Desktop>
            </div>
          </div>
        </Column>
      </Row>
      <div className="map-settings-wrapper">
        <Row className="map-settings">
          <Column width={[1 / 4, 0]} className="mobile-basemaps-btn">
            <Mobile>
              <div className="map-settings-item">
                <Button
                  round
                  size="large"
                  clear
                  onClick={() => setShowBasemaps(!showBasemaps)}
                >
                  <img
                    src={activeBasemap.image}
                    alt={activeBasemap.label}
                    className="basemap-img"
                  />
                </Button>
                <span className="item-label">
                  {activeBasemap.label}
                  {activeBasemap.year && ` - ${activeBasemap.year}`}
                </span>
              </div>
            </Mobile>
          </Column>
          <Column width={[1 / 4, 1 / 3]} className="map-settings-col">
            <Dropdown
              className="map-settings-dropdown"
              theme={cx("theme-dropdown-button", {
                "theme-dropdown-dark-round theme-dropdown-no-border":
                  !isDesktop,
                "theme-dropdown-dark-squared": isDesktop,
              })}
              value={selectedBoundaries}
              options={boundaries}
              onChange={selectBoundaries}
              selectorIcon={boundariesIcon}
            />
          </Column>
          <Column width={[1 / 4, 1 / 3]} className="map-settings-col">
            <Dropdown
              className="map-settings-dropdown"
              theme={cx("theme-dropdown-button", {
                "theme-dropdown-dark-round theme-dropdown-no-border":
                  !isDesktop,
                "theme-dropdown-dark-squared": isDesktop,
              })}
              value={labelSelected}
              options={labels}
              onChange={selectLabels}
              selectorIcon={labelsIcon}
            />
          </Column>
          <Column width={[1 / 4, 1 / 3]} className="map-settings-col">
            <Dropdown
              className="map-settings-dropdown"
              theme={cx("theme-dropdown-button", {
                "theme-dropdown-dark-round theme-dropdown-no-border":
                  !isDesktop,
                "theme-dropdown-dark-squared": isDesktop,
              })}
              value={roadsSelected}
              options={roads}
              onChange={selectRoads}
              selectorIcon={roadsIcon}
            />
          </Column>
        </Row>
        {(isDesktop || showBasemaps) && (
          <BasemapsMenu
            basemaps={basemaps}
            activeBasemap={activeBasemap}
            onSelectBasemap={selectBasemap}
          />
        )}
        {isDesktop && (
          <div className="analysis-settings">
            <Row>
              <Column>
                <Desktop>
                  <h4>Settings</h4>
                </Desktop>
              </Column>
              <Column>
                <Row>
                  <div className="setting-toggle ">
                    <Toggle
                      theme="toggle-large"
                      value={clipToGeostore}
                      onToggle={() =>
                        setMapSettings({ clipToGeostore: !clipToGeostore })
                      }
                    />
                    <div>Clip To Boundary</div>
                  </div>
                </Row>
              </Column>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

Basemaps.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  boundaries: PropTypes.array,
  basemaps: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
  labelSelected: PropTypes.object.isRequired,
  selectLabels: PropTypes.func.isRequired,
  selectBasemap: PropTypes.func.isRequired,
  activeBasemap: PropTypes.object.isRequired,
  selectBoundaries: PropTypes.func.isRequired,
  activeBoundaries: PropTypes.object,
  isDesktop: PropTypes.bool,
  getTooltipContentProps: PropTypes.func.isRequired,
  setModalMetaSettings: PropTypes.func,
  roadsSelected: PropTypes.object.isRequired,
  selectRoads: PropTypes.func.isRequired,
  roads: PropTypes.array.isRequired,
  onLayerSettingToggle: PropTypes.func.isRequired,
  analysisSettings: PropTypes.object,
};

export default Basemaps;
