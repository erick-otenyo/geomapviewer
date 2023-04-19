import { createElement, PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import intersection from "lodash/intersection";
import isEqual from "lodash/isEqual";
import compact from "lodash/compact";

import { POLITICAL_BOUNDARIES_DATASET } from "@/data/datasets";
import { POLITICAL_BOUNDARIES } from "@/data/layers";

import reducerRegistry from "@/redux/registry";

import { setDashboardPromptsSettings } from "@/components/prompts/dashboard-prompts/actions";
import { setMapSettings as setMapState } from "@/components/map/actions";
import { setModalMetaSettings } from "@/components/modals/meta/actions";
import { setShareModal } from "@/components/modals/share/actions";

import { getWidgetDatasets, getPolynameDatasets } from "./utils/config";
import * as ownActions from "./actions";
import reducers, { initialState } from "./reducers";
import Component from "./component";
import { getWidgetsProps } from "./selectors";

const actions = {
  ...ownActions,
  setMapSettings: setMapState,
  setModalMetaSettings,
  setDashboardPromptsSettings,
  setShareModal,
};

const mapSyncKeys = [
  "startYear",
  "endYear",
  "threshold",
  "extentYear",
  "forestType",
  "landCategory",
];

const adminBoundaryLayer = {
  dataset: POLITICAL_BOUNDARIES_DATASET,
  layers: [POLITICAL_BOUNDARIES],
  opacity: 1,
  visibility: true,
};

const makeMapStateToProps = () => {
  const getWidgetPropsObject = getWidgetsProps();
  const mapStateToProps = (state, props) => ({
    ...getWidgetPropsObject(state, props),
  });
  return mapStateToProps;
};

class WidgetsContainer extends PureComponent {
  static propTypes = {
    getWidgetsData: PropTypes.func,
    location: PropTypes.object,
    category: PropTypes.string,
    activeWidget: PropTypes.object,
    setMapSettings: PropTypes.func,
    setActiveWidget: PropTypes.func,
    embed: PropTypes.bool,
    setWidgetsCategory: PropTypes.func,
    setDashboardPromptsSettings: PropTypes.func,
  };

  componentDidMount() {
    const { activeWidget, embed } = this.props;

    if (!embed && activeWidget && activeWidget.datasets) {
      this.syncWidgetWithMap();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      getWidgetsData,
      setWidgetsCategory,
      activeWidget,
      embed,
      location,
      category,
      setActiveWidget,
    } = this.props;

    if (!isEqual(category, prevProps.category)) {
      setActiveWidget(null);
      setWidgetsCategory(category || "summary");
    }

    // if widget is active and layers or params change push to map
    if (!embed && activeWidget) {
      const { settings, datasets } = activeWidget || {};
      const { settings: prevSettings, datasets: prevDatasets } =
        prevProps.activeWidget || {};

      const mapSettingsChanged =
        settings &&
        intersection(mapSyncKeys, Object.keys(settings)).length &&
        !isEqual(settings, prevSettings);
      const activeWidgetChanged = !isEqual(
        activeWidget,
        prevProps.activeWidget
      );
      const widgetSettingsChanged = !isEqual(prevSettings, settings);
      const datasetsChanged = !isEqual(datasets, prevDatasets);

      if (
        (datasets &&
          datasetsChanged &&
          (mapSettingsChanged || activeWidgetChanged)) ||
        widgetSettingsChanged
      ) {
        this.syncWidgetWithMap();
      } else if (
        !datasets &&
        activeWidgetChanged &&
        !isEqual(settings, prevSettings)
      ) {
        this.clearMap();
      }
    }
  }

  syncWidgetWithMap = () => {
    const { activeWidget, setMapSettings, setWidgetsCategory } = this.props;
    const { datasets, settings, optionsSelected } = activeWidget || {};
    const widgetDatasets =
      datasets &&
      datasets.length &&
      getWidgetDatasets({ datasets, ...settings });

    let allDatasets = [];

    if (widgetDatasets) {
      allDatasets = [...allDatasets, ...widgetDatasets];
    }

    setWidgetsCategory(this.props?.category || "summary");

    setMapSettings({
      datasets: allDatasets,
    });
  };

  clearMap = () => {
    const { setMapSettings } = this.props;
    setMapSettings({
      datasets: [adminBoundaryLayer],
    });
  };

  handleClickWidget = (widget) => {
    if (widget.active && !this.props.embed) {
      this.props.setDashboardPromptsSettings({
        open: true,
        stepIndex: 0,
        stepsKey: "widgetSettings",
      });
    }
  };

  render() {
    return createElement(Component, {
      ...this.props,
      handleClickWidget: this.handleClickWidget,
    });
  }
}

reducerRegistry.registerModule("widgets", {
  actions,
  reducers,
  initialState,
});

export default connect(makeMapStateToProps, actions)(WidgetsContainer);
