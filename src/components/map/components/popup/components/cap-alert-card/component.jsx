import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Card from "@/components/ui/cap-alert-card";

import "./styles.scss";

class CapAlertCard extends PureComponent {
  render() {
    const { data } = this.props;

    return (
      <Card
        className="c-cap-alert-card"
        theme="theme-card-small"
        clamp={5}
        data={{
          ...data,
        }}
      />
    );
  }
}

CapAlertCard.propTypes = {
  data: PropTypes.object,
};

export default CapAlertCard;
