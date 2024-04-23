import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import "./styles.scss";

class LegendTypeGradientVertical extends PureComponent {
  static propTypes = {
    // Props
    activeLayer: PropTypes.shape({}),
  };

  static defaultProps = {
    // Props
    activeLayer: {},
  };

  render() {
    const { activeLayer } = this.props;
    const { legendConfig } = activeLayer;

    if (!legendConfig || legendConfig.type !== "gradient_vertical") {
      return null;
    }

    const items = legendConfig.items.filter(
      (item) => item.color !== "transparent"
    );
    const itemTransparent = legendConfig.items.find(
      (item) => item.color === "transparent"
    );
    const gradient = items.map((item) => item.color);

    return (
      <div className="c-legend-type-gradient-vertical">
        {legendConfig.units && (
          <div className="units">{legendConfig.units}</div>
        )}
        <div style={{ display: "flex" }}>
          <div className="legend-gradient-icon">
            <div>
              {itemTransparent && (
                <div
                  style={{ height: 24, width: 12 }}
                  className="icon-gradient-transparent"
                />
              )}
              <div
                className="icon-gradient"
                style={{
                  width: 12,
                  height: `${items.length * 24}px`,
                  backgroundImage: `linear-gradient(to bottom, ${gradient.join(
                    ","
                  )})`,
                }}
              />
            </div>
          </div>
          <ul>
            {legendConfig.items.map(({ name, color, value }) =>
              name || value ? (
                <li key={`legend-gradient-item-${color}-${value}-${name}`}>
                  <span className="name">{name || value}</span>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default LegendTypeGradientVertical;
