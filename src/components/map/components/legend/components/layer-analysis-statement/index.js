import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";

class LayerAnalysisStatement extends PureComponent {
  render() {
    const { className, statementHtml } = this.props;

    return <div>{ReactHtmlParser(statementHtml)}</div>;
  }
}

LayerAnalysisStatement.propTypes = {
  className: PropTypes.string,
  statementHtml: PropTypes.string,
};

export default LayerAnalysisStatement;
