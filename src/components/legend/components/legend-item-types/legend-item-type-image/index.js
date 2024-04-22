import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import "./styles.scss";

class LegendTypeImage extends PureComponent {
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

    if (!legendConfig || legendConfig.type !== "image") {
      return null;
    }

    return (
      <div className="c-legend-type-image">
        {legendConfig.units && (
          <div className="units">{legendConfig.units}</div>
        )}
        <img src={legendConfig.imageUrl} alt={`${activeLayer.name} - Legend`} />
      </div>
    );
  }
}

export default LegendTypeImage;
