import React, { Component } from "react";

import Button from "@/components/ui/button/component";

import "./styles.scss";

class CompareControls extends Component {
  render() {
    const { active, onChange } = this.props;

    return (
      <div className="c-compare-controls">
        <Button
          theme="theme-button-medium theme-button-light"
          className="compare-btn"
          onClick={onChange}
        >
          {active ? "Exit Comparison" : "Start Comparison"}
        </Button>
      </div>
    );
  }
}

export default CompareControls;
