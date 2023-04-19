import React, { Component } from "react";
import compact from "lodash/compact";

import Icon from "@/components/ui/icon";
import Button from "@/components/ui/button";

import cutIcon from "@/assets/icons/cut.svg?sprite";
import calendarIcon from "@/assets/icons/calendar.svg?sprite";
import analysisIcon from "@/assets/icons/analysis.svg?sprite";
import satelliteIcon from "@/assets/icons/satellite.svg?sprite";

import "./styles.scss";

const getCap = (capability) => {
  if (capability === "clip") {
    return { type: capability, icon: cutIcon, text: "Supports Clipping" };
  }

  if (capability === "timeseries") {
    return {
      type: capability,
      icon: calendarIcon,
      text: "Supports Time",
    };
  }

  if (capability === "analysis") {
    return { type: capability, icon: analysisIcon, text: "Supports Analysis" };
  }

  if (capability === "nearRealTime") {
    return {
      type: capability,
      icon: satelliteIcon,
      text: "Near Real Time",
      className: "nrt-indicator",
    };
  }

  return null;
};

export default class LayerCapabilities extends Component {
  renderCapabilities = () => {
    const { capabilities } = this.props;

    if (capabilities && !!capabilities.length) {
      {
        const caps = capabilities.map((cap) => {
          const capDef = getCap(cap);

          if (capDef) {
            return (
              <Button
                key={capDef.type}
                theme="theme-button-clear"
                className="cap-btn"
                tooltip={{ text: capDef.text }}
              >
                <Icon icon={capDef.icon} className={capDef.className} />
              </Button>
            );
          }
          return null;
        });

        return compact(caps);
      }
    }

    return null;
  };

  render() {
    const capabilities = this.renderCapabilities();

    if (capabilities && !!capabilities.length) {
      return <div className="c-layer-capabilities">{capabilities}</div>;
    }

    return null;
  }
}
