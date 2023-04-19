import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import ChangeInfographic from "@/components/charts/change-infographic";

class WidgetChangeInfographic extends PureComponent {
  render() {
    const { data } = this.props;

    return <ChangeInfographic data={data} />;
  }
}

WidgetChangeInfographic.propTypes = {
  data: PropTypes.array,
};

export default WidgetChangeInfographic;
