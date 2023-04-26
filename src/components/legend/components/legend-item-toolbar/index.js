import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import LegendItemButtonOpacity from "./legend-item-button-opacity";
import LegendItemButtonInfo from "./legend-item-button-info";
import LegendItemButtonRemove from "./legend-item-button-remove";

import "./styles.scss";

class LegendItemToolbar extends PureComponent {
  static propTypes = {
    // Props
    children: PropTypes.node,
    enabledStyle: PropTypes.object,
    defaultStyle: PropTypes.object,
    disabledStyle: PropTypes.object,
    focusStyle: PropTypes.object,

    // ACTIONS
    onChangeOpacity: PropTypes.func,
    onRemoveLayer: PropTypes.func,
    onChangeInfo: PropTypes.func,
  };

  static defaultProps = {
    // Props
    children: [],
    defaultStyle: {
      fill: "#717171",
    },
    enabledStyle: {
      fill: "#2C75B0",
    },
    disabledStyle: {
      fill: "#CACCD0",
    },
    focusStyle: {
      fill: "#2C75B0",
    },

    // ACTIONS
    onChangeInfo: (l) => console.info(l),
    onChangeLayer: (l) => console.info(l),
    onChangeOpacity: (l, o) => console.info(l, o),
    onRemoveLayer: (l) => console.info(l),
  };

  state = {
    tooltipOpened: false,
  };

  onTooltipVisibilityChange = (tooltipOpened) => {
    this.setState({ tooltipOpened });
  };

  render() {
    const { children, ...rest } = this.props;
    const { tooltipOpened } = this.state;
    const props = {
      ...rest,
      tooltipOpened,
      onTooltipVisibilityChange: this.onTooltipVisibilityChange,
    };

    return (
      <div className="c-legend-item-toolbar">
        {!!React.Children.count(children) &&
          React.Children.map(children, (child) =>
            React.isValidElement(child) && typeof child.type !== "string"
              ? React.cloneElement(child, { ...props })
              : child
          )}

        {/* If there is no children defined, let's use the components we had */}
        {!React.Children.count(children) && (
          <LegendItemButtonOpacity {...props} />
        )}
        {!React.Children.count(children) && <LegendItemButtonInfo {...props} />}
        {!React.Children.count(children) && (
          <LegendItemButtonRemove {...props} />
        )}
      </div>
    );
  }
}
export default LegendItemToolbar;

export {
  LegendItemButtonOpacity,
  LegendItemButtonInfo,
  LegendItemButtonRemove,
};
