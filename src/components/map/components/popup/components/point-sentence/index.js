import React, { Component } from "react";
import PropTypes from "prop-types";
import { formatNumber } from "@/utils/format";
import Button from "@/components/ui/button";

import "./styles.scss";

class PointSentence extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    selected: PropTypes.object,
    onAnalyze: PropTypes.func,
  };

  render() {
    const { lat, lon, onAnalyze } = this.props;

    return lat && lon ? (
      <div className="c-point-sentence">
        <div className="sentence">
          <p>
            <b>Lat: </b> {formatNumber({ num: lat, unit: "" })}
          </p>
          <p>
            <b>Lng: </b> {formatNumber({ num: lon, unit: "" })}
          </p>
        </div>

        <Button
          onClick={() => {
            onAnalyze();
          }}
        >
          analyze
        </Button>
      </div>
    ) : null;
  }
}

export default PointSentence;
