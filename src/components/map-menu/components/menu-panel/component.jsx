import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import startCase from "lodash/startCase";

import Loader from "@/components/ui/loader";
import Button from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import closeIcon from "@/assets/icons/close.svg?sprite";
import arrowIcon from "@/assets/icons/arrow-down.svg?sprite";
import posed, { PoseGroup } from "react-pose";

import "./styles.scss";

const PanelMobile = posed.div({
  enter: {
    y: 0,
    opacity: 1,
    delay: 200,
    transition: { duration: 200 },
  },
  exit: {
    y: 50,
    opacity: 0,
    delay: 200,
    transition: { duration: 200 },
  },
});

const PanelDesktop = posed.div({
  enter: {
    x: 76,
    opacity: 1,
    delay: 300,
  },
  exit: {
    x: 0,
    opacity: 0,
    transition: { duration: 200 },
  },
});

class MenuPanel extends PureComponent {
  panelLabel() {
    const { label, category, setMenuSettings } = this.props;
    const isSearch = label.toLowerCase() === "search";

    if (category || isSearch) {
      return (
        <button
          onClick={() =>
            setMenuSettings({
              ...(category && { datasetCategory: "" }),
              ...(isSearch && { searchType: "" }),
            })
          }
        >
          <Icon icon={arrowIcon} className="icon-return" />
          <span>{isSearch ? label : startCase(category)}</span>
        </button>
      );
    }

    return <span>{label}</span>;
  }

  render() {
    const {
      active,
      className,
      isDesktop,
      large,
      onClose,
      onOpen,
      children,
      loading,
      collapsed,
    } = this.props;
    const Panel = isDesktop ? PanelDesktop : PanelMobile;

    return (
      <PoseGroup>
        {active && (
          <Panel
            key="menu-container"
            className={cx(
              "c-menu-panel",
              "map-tour-menu-panel",
              { large },
              className
            )}
          >
            {!isDesktop ? (
              <div className="panel-header">
                <div className="panel-label">{this.panelLabel()}</div>
                <Button
                  className="panel-close"
                  theme="theme-button-clear"
                  onClick={collapsed ? onOpen : onClose}
                >
                  <Icon
                    icon={arrowIcon}
                    className={cx("icon-close-panel", { collapsed })}
                  />
                </Button>
              </div>
            ) : (
              <button className="close-menu" onClick={onClose}>
                <Icon icon={closeIcon} className="icon-close-panel" />
              </button>
            )}
            {!loading && <div className="panel-body">{children}</div>}
            {loading && <Loader className="map-menu-loader" />}
          </Panel>
        )}
      </PoseGroup>
    );
  }
}

MenuPanel.propTypes = {
  children: PropTypes.node,
  large: PropTypes.bool,
  className: PropTypes.string,
  onClose: PropTypes.func,
  setMenuSettings: PropTypes.func,
  isDesktop: PropTypes.bool,
  label: PropTypes.string,
  category: PropTypes.string,
  active: PropTypes.bool,
  loading: PropTypes.bool,
  collapsed: PropTypes.bool,
  onOpen: PropTypes.func,
};

export default MenuPanel;
