import { createElement, PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { trackEvent } from "@/utils/analytics";

import { setModalMetaSettings } from "@/components/modals/meta/actions";
import Component from "./component";

class DatasetsMenuContainer extends PureComponent {
  static propTypes = {
    activeDatasets: PropTypes.array,
    setMapSettings: PropTypes.func,
    selectedCountry: PropTypes.string,
    setMenuSettings: PropTypes.func,
  };

  handleChangeCountry = (country) => {
    const { setMenuSettings } = this.props;
    setMenuSettings({
      mapLocationContext: country.value,
    });

    trackEvent({
      category: "Map menu",
      action: "User selects a region",
      label: country?.label,
    });
  };

  render() {
    return createElement(Component, {
      ...this.props,

      handleChangeCountry: this.handleChangeCountry,
    });
  }
}

export default connect(null, { setModalMetaSettings })(DatasetsMenuContainer);
