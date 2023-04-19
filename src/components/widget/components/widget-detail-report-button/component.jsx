import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Button from "@/components/ui/button";

import "./styles.scss";

class WidgetDetailButton extends PureComponent {
  static propTypes = {
    detailReport: PropTypes.object,
    location: PropTypes.object,
  };

  getLink = () => {
    const { detailReport, location } = this.props;

    const { type } = location;

    let link;

    if (
      type === "point" &&
      detailReport.point &&
      detailReport.point.linkTemplate
    ) {
      link = detailReport.point.linkTemplate;

      if (detailReport && detailReport.point.locationParams) {
        detailReport.point.locationParams.forEach((param) => {
          if (location[param]) {
            const paramVal = Number(location[param]);

            const tpl = "{" + param + "}";

            link = link.replace(`${tpl}`, paramVal);
          }
        });
      }
    }

    if (link) {
      return link;
    }

    return null;
  };

  render() {
    const link = this.getLink();

    if (link) {
      return (
        <div className="c-widget-detail-report-btn">
          <Button theme="theme-button-small" extLink={link}>
            View detailed report
          </Button>
        </div>
      );
    }

    return null;
  }
}

export default WidgetDetailButton;
