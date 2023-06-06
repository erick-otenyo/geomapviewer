import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import cx from "classnames";

import WidgetMapButton from "./components/widget-map-button";
import WidgetSettingsButton from "./components/widget-settings-button";
import WidgetInfoButton from "./components/widget-info-button";
import WidgetShareButton from "./components/widget-share-button";
import Icon from "@/components/ui/icon";

import analysisIcon from "@/assets/icons/analysis.svg?sprite";

import "./styles.scss";

class WidgetHeader extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    widget: PropTypes.string,
    large: PropTypes.bool,
    maxSize: PropTypes.number,
    proxy: PropTypes.bool,
    proxyOn: PropTypes.array,
    datasets: PropTypes.array,
    loading: PropTypes.bool,
    embed: PropTypes.bool,
    simple: PropTypes.bool,
    active: PropTypes.bool,
    disableDownload: PropTypes.bool,
    filterSelected: PropTypes.bool,
    metaKey: PropTypes.string,
    settingsConfig: PropTypes.array,
    settings: PropTypes.object,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func,
    handleShowMap: PropTypes.func,
    handleShowShare: PropTypes.func,
    preventCloseSettings: PropTypes.bool,
    getDataURL: PropTypes.func,
    status: PropTypes.string,
    shouldSettingsOpen: PropTypes.bool,
    toggleSettingsMenu: PropTypes.func,
    authenticated: PropTypes.bool,
  };

  render() {
    const {
      title,
      loading,
      active,
      embed,
      proxy,
      proxyOn,
      large,
      datasets,
      simple,
      settingsConfig,
      metaKey,
      handleShowMap,
      handleShowInfo,
      handleChangeSettings,
      handleShowShare,
      preventCloseSettings,
      settings,
      shouldSettingsOpen,
      toggleSettingsMenu,
    } = this.props;

    const showSettingsBtn = !simple && !isEmpty(settingsConfig);
    const showMapBtn = !embed && !simple && datasets;
    const showSeparator = showSettingsBtn || showMapBtn;
    const metaInfo =
      typeof metaKey === "function" ? metaKey(settings) : metaKey;

    return (
      <div className={cx("c-widget-header", { simple })}>
        <div className="title">
          <span>
            <Icon className="analysis-icon" icon={analysisIcon} />
          </span>
          <span>{title}</span>
        </div>
        <div className="options">
          {showMapBtn && (
            <WidgetMapButton
              active={active}
              large={large}
              handleShowMap={handleShowMap}
            />
          )}
          {showSettingsBtn && (
            <WidgetSettingsButton
              settingsConfig={settingsConfig}
              loading={loading}
              title={title}
              embed={embed}
              proxy={proxy}
              proxyOn={proxyOn}
              handleChangeSettings={handleChangeSettings}
              handleShowInfo={handleShowInfo}
              preventCloseSettings={preventCloseSettings}
              active={active}
              shouldSettingsOpen={shouldSettingsOpen}
              toggleSettingsMenu={toggleSettingsMenu}
            />
          )}
          {showSeparator && <span className="separator" />}
          <div className="small-options">
            <WidgetInfoButton
              square={simple}
              handleOpenInfo={() => handleShowInfo(metaInfo)}
            />
            {!simple && <WidgetShareButton handleShowShare={handleShowShare} />}
          </div>
        </div>
      </div>
    );
  }
}

export default WidgetHeader;
