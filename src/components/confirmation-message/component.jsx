import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";

import Icon from "@/components/ui/icon";

import treeImage from "@/assets/icons/tree-success.png";
import treeImageError from "@/assets/icons/error.svg?sprite";
import checkIcon from "@/assets/icons/check.svg?sprite";

import "./styles.scss";

class Thankyou extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    error: PropTypes.bool,
    simple: PropTypes.bool,
  };

  render() {
    const { title, description, error, simple } = this.props;

    return (
      <div className="c-thankyou">
        <div className={`message ${simple ? "simple" : ""} `}>
          {!simple && error && (
            <Icon icon={treeImageError} className="error-tree" />
          )}
          {!simple && !error && <img src={treeImage} alt="thank-you-tree" />}
          {simple && !error && (
            <Icon icon={checkIcon} className="success-icon" />
          )}
          <h1 className={`${simple ? "simple" : ""}`}>{title}</h1>
          {description && <p>{ReactHtmlParser(description)}</p>}
        </div>
      </div>
    );
  }
}

export default Thankyou;
