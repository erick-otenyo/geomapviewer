import React, { Component } from "react";
import Select from "react-select";

import MenuPortal from "./MenuPortal";

export default class LayerFilterSelector extends Component {
  render() {
    const { options, value, onChange, isMulti } = this.props;

    return (
      <Select
        menuPosition="fixed"
        // menuIsOpen
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={onChange}
        components={{ MenuPortal }}
      />
    );
  }
}
