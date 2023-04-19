import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import uniqueId from "lodash/uniqueId";

import Icon from "@/components/ui/icon";
import infoIcon from "@/assets/icons/info.svg?sprite";

import "./styles.scss";

class RadioGroup extends PureComponent {
  handleOnChange = (e) => {
    const val = e.target.value;
    this.props.onChange(val);
  };

  render() {
    const { className, options, value } = this.props;

    return (
      <div className={cx("c-radio-group", className)}>
        {!!options.length &&
          options.map((option) => {
            const id = uniqueId(`radio-${option.value}-`);
            return (
              <div key={option.value} className="radio-option">
                <input
                  id={id}
                  type="radio"
                  value={option.value}
                  checked={option.value === value}
                  onChange={this.handleOnChange}
                  className="radio-input"
                />
                <label className="radio-label" htmlFor={id}>
                  <span />
                  <div className="r-text">
                    <div className="r-title">{option.label}</div>
                    {option.description && (
                      <div className="r-desc">
                        <Icon icon={infoIcon} className="info-icon" />
                        {option.description}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            );
          })}
      </div>
    );
  }
}

RadioGroup.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default RadioGroup;
