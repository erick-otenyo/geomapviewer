import React, { PureComponent } from "react";

import Toggle from "@/components/ui/toggle";

import "./styles.scss";

class LayerSettings extends PureComponent {
  renderClipSetting = () => {
    const { layer, onToggleSetting, location } = this.props;
    const { settings = {}, canClip } = layer;

    const enabledLocations = ["country", "geostore", "aoi"];

    const showSetting =
      location.type && enabledLocations.includes(location.type) && canClip;

    if (showSetting) {
      const { clippingActive } = settings;

      const active = clippingActive === true;

      return (
        <div className="setting-toggle">
          <Toggle
            theme="toggle-large"
            value={active}
            onToggle={(value) => {
              onToggleSetting("clippingActive", value);
            }}
          />
          <div className="setting-label">Clip to Shape</div>
        </div>
      );
    }
  };

  render() {
    return <div>{this.renderClipSetting()}</div>;
  }
}

export default LayerSettings;
