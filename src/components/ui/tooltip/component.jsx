import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import RCTooltip from "rc-tooltip/lib";

import "./styles.scss";

export class Tooltip extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: [],
  };

  render() {
    const { children } = this.props;
    return <RCTooltip {...this.props}>{children}</RCTooltip>;
  }
}

export default Tooltip;
