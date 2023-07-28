import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Checkbox from "@/components/ui/checkbox";

import uniqueId from "lodash/uniqueId";
import find from "lodash/find";
import findIndex from "lodash/findIndex";

import "./styles.scss";

class CheckboxGroup extends PureComponent {
  handleOnChange = (option) => {
    const { value, onChange } = this.props;

    const values = [...value];

    const index = findIndex(values, ["value", option.value]);

    if (index > -1) {
      values.splice(index, 1); // remove from array
    } else {
      values.push(option);
    }

    if (onChange) {
      onChange(values);
    }
  };

  render() {
    const { className, options, value } = this.props;

    return (
      <div className={cx("c-checkbox-group", className)}>
        {!!options.length &&
          options.map((option) => {
            const id = uniqueId(`checkbox-${option.value}-`);
            const checked = Boolean(find(value, { value: option.value }));
            return (
              <div key={option.value} className="checkbox-option">
                <button
                  className="checkbox-btn"
                  onClick={() => this.handleOnChange(option)}
                >
                  <Checkbox id={id} value={checked} />
                  <label className="checkbox-label" htmlFor={id}>
                    <span />
                    {option.label}
                  </label>
                </button>
              </div>
            );
          })}
      </div>
    );
  }
}

CheckboxGroup.propTypes = {
  className: PropTypes.string,
  value: PropTypes.array,
  options: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default CheckboxGroup;
