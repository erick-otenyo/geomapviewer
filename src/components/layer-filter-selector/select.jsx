import React, { Component } from "react";
import Select from "react-select";

import MenuPortal from "./MenuPortal";

export default class LayerSelect extends Component {
  handleOnSelectChange = (value, action) => {
    const { isMulti, onChange, options } = this.props;

    if (action.option && action.option.value && action.option.value === "all") {
      const allOption = options.find((o) => o.value === "all");
      return onChange(allOption);
    }

    if (isMulti && value.length) {
      const options = value.filter((o) => o.value !== "all");
      return onChange(options);
    }

    if (isMulti && !value.length) {
      const allOption = options.find((o) => o.value === "all");
      return onChange([allOption]);
    }

    return onChange(value);
  };

  render() {
    const { options, value, isMulti } = this.props;

    return (
      <Select
        menuPosition="fixed"
        // menuIsOpen
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={this.handleOnSelectChange}
        components={{ MenuPortal }}
      />
    );
  }
}
