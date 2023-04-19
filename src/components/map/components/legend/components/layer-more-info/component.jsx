import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Button from "@/components/ui/button";

import Icon from "@/components/ui/icon";
import arrowRight from "@/assets/icons/arrow-right.svg?sprite";

import "./styles.scss";

class LayerMoreInfo extends PureComponent {
  render() {
    const {
      className,
      linkUrl,
      linkText,
      text,
      showArrow,
      isButton,
    } = this.props;

    return (
      <div className={`c-layer-more-info ${className || ""}`}>
        <p>{text}</p>

        {isButton ? (
          <Button className="theme-button-medium more-btn" extLink={linkUrl}>
            {linkText}

            {showArrow && <Icon className="go-icon" icon={arrowRight} />}
          </Button>
        ) : (
          <div className="more-link">
            <a href={linkUrl} target="_blank" rel="noopener nofollower">
              {linkText}
            </a>
          </div>
        )}
      </div>
    );
  }
}

LayerMoreInfo.propTypes = {
  className: PropTypes.string,
  linkUrl: PropTypes.string,
  linkText: PropTypes.string,
  text: PropTypes.string,
};

export default LayerMoreInfo;
