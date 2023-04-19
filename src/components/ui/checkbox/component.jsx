import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import "./styles.scss";

class Checkbox extends PureComponent {
  handleOnChange = () => {
    const { onChange, value } = this.props;

    if (onChange) {
      onChange(value);
    }
  };
  render() {
    const { className, value, id, onChange } = this.props;
    return (
      <div
        id={id && id}
        className={cx("c-checkbox", className)}
        onClick={this.handleOnChange}
      >
        <span className={cx("green-square", { checked: value })} />
      </div>
    );
  }
}

Checkbox.propTypes = {
  className: PropTypes.string,
  value: PropTypes.bool,
};

export default Checkbox;
