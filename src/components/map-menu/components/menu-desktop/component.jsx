import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import startCase from "lodash/startCase";
import { trackEvent } from "@/utils/analytics";

import MenuTile from "../menu-tile";

import "./styles.scss";

class MenuDesktop extends PureComponent {
  render() {
    const {
      className,
      upperSections,
      datasetSections,
      searchSections,
      setMenuSettings,
    } = this.props;

    return (
      <div className={cx("c-menu-desktop", className)}>
        <ul className="datasets-menu">
          {upperSections && !!upperSections.length && (
            <div className="upper-sections">
              {upperSections.map((s) => (
                <MenuTile
                  className="search-tile"
                  key={s.slug}
                  onClick={() => {
                    setMenuSettings({
                      menuSection: s.active ? "" : s.slug,
                      datasetCategory: "",
                    });
                    if (!s.active) {
                      trackEvent({
                        category: "Map menu",
                        action: "Select Map menu",
                        label: s.slug,
                      });
                    }
                  }}
                  {...s}
                />
              ))}
            </div>
          )}
          {datasetSections &&
            datasetSections
              .filter((s) => !s.hiddenMobile)
              .map((s) => (
                <MenuTile
                  className="datasets-tile"
                  key={`${s.slug}_${s.category}`}
                  {...s}
                  label={s.category}
                  onClick={() => {
                    setMenuSettings({
                      datasetCategory: s.active ? "" : s.category,
                      menuSection: s.active ? "" : s.slug,
                    });
                    if (!s.active) {
                      trackEvent({
                        category: "Map menu",
                        action: "Select Map menu",
                        label: s.slug,
                      });
                    }
                  }}
                />
              ))}
        </ul>
        <ul className="datasets-menu">
          {searchSections &&
            searchSections.map((s) => (
              <MenuTile
                className="search-tile"
                key={s.slug}
                onClick={() => {
                  setMenuSettings({
                    menuSection: s.active ? "" : s.slug,
                    datasetCategory: "",
                  });
                  if (!s.active) {
                    trackEvent({
                      category: "Map menu",
                      action: "Select Map menu",
                      label: s.slug,
                    });
                  }
                }}
                {...s}
              />
            ))}
        </ul>
      </div>
    );
  }
}

MenuDesktop.propTypes = {
  upperSections: PropTypes.array,
  datasetSections: PropTypes.array,
  searchSections: PropTypes.array,
  setMenuSettings: PropTypes.func,
  className: PropTypes.string,
};

export default MenuDesktop;
