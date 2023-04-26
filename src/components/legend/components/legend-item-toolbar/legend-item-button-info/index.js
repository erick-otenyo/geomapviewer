import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Icon from "@/components/ui/icon";
import Tooltip from "@/components/ui/tooltip";

import infoIcon from "@/assets/icons/info-fill.svg?sprite";

import "../styles-button.scss";

class LegendItemButtonInfo extends PureComponent {
  static propTypes = {
    activeLayer: PropTypes.object,
    icon: PropTypes.string,
    focusStyle: PropTypes.object,
    defaultStyle: PropTypes.object,
    tooltipOpened: PropTypes.bool,
    tooltipText: PropTypes.string,
    scrolling: PropTypes.bool,

    // ACTIONS
    onChangeInfo: PropTypes.func,
  };

  static defaultProps = {
    activeLayer: {},
    icon: "",
    focusStyle: {},
    defaultStyle: {},
    tooltipOpened: false,
    tooltipText: "",
    scrolling: false,

    onChangeInfo: () => {},
  };

  state = {
    visible: false,
  };

  componentWillReceiveProps(nextProps) {
    const { scrolling } = nextProps;

    if (scrolling) {
      this.setState({ visible: false });
    }
  }

  render() {
    const {
      activeLayer,
      tooltipOpened,
      icon,
      focusStyle,
      defaultStyle,
      tooltipText,
    } = this.props;
    const { visible } = this.state;

    return (
      <Tooltip
        overlay={tooltipText || "Layer info"}
        overlayClassName="c-rc-tooltip -default"
        placement="top"
        trigger={tooltipOpened ? "" : "hover"}
        mouseLeaveDelay={0}
        destroyTooltipOnHide
        onVisibleChange={(v) => this.setState({ visible: v })}
        visible={visible}
      >
        <button
          type="button"
          className="c-legend-button"
          aria-label="More information"
          onClick={() => this.props.onChangeInfo(activeLayer)}
        >
          <Icon
            icon={icon || infoIcon}
            className="-small"
            style={visible ? focusStyle : defaultStyle}
          />
        </button>
      </Tooltip>
    );
  }
}

export default LegendItemButtonInfo;
