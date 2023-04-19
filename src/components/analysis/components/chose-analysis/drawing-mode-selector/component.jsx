import React, { PureComponent } from "react";
import cx from "classnames";

import Icon from "@/components/ui/icon/component";

import "./styles.scss";

class DrawingModeSelector extends PureComponent {
  render() {
    const { options, activeMode, onChange } = this.props;

    if (options) {
      return (
        <div className="c-drawing-modes">
          {options.map((option) => (
            <div
              className={cx("drawing-mode", {
                active: option.value === activeMode,
              })}
              key={option.value}
              onClick={() => onChange(option.value)}
            >
              {option.icon && (
                <Icon className="draw-mode-icon" icon={option.icon} />
              )}
              <div className="draw-mode-label">{option.label}</div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  }
}

export default DrawingModeSelector;
