import { createSelector, createStructuredSelector } from "reselect";
import sortBy from "lodash/sortBy";
import intersection from "lodash/intersection";
import uniq from "lodash/uniq";
import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import lowerCase from "lodash/lowerCase";
import flatMap from "lodash/flatMap";
import camelCase from "lodash/camelCase";
import qs from "query-string";
import { translateText } from "@/utils/lang";

import { getActiveLayers } from "@/components/map/selectors";
import { getDataLocation } from "@/utils/location";

import colors from "@/data/colors.json";
import { locationLevelToStr } from "@/utils/location";

import {
  getSettingsConfig,
  getOptionsSelected,
  getLocationPath,
} from "./utils/config";

import customWidgets from "./manifest";

import getTimeseriesWidget from "./timeseries-widget";

const isServer = typeof window === "undefined";

const buildLocationDict = (locations) =>
  (locations &&
    !!locations.length &&
    locations.reduce(
      (dict, next) => ({
        ...dict,
        [next.value || next.id]: {
          ...next,
        },
      }),
      {}
    )) ||
  {};

export const selectLocation = (state) =>
  state.location && state.location.payload;
export const selectRouteType = (state) =>
  state.location && state.location.pathname;
export const selectActiveWidget = (state) => state.widgets?.activeWidget;
export const selectLocationQuery = (state) =>
  state.location && state.location.query;
export const selectWidgetSettings = (state) => state.widgets?.settings || {};
export const selectWidgetInteractions = (state) =>
  state.widgets?.interactions || {};
export const selectLocationSearch = (state) =>
  state.location && state.location.search;
export const selectWidgetsData = (state) => state.widgets && state.widgets.data;
export const selectGeostore = (state) => state.geostore && state.geostore.data;
export const selectLoadingFilterData = (state) =>
  state.countryData &&
  state.whitelists &&
  state.areas &&
  (state.countryData.countriesLoading ||
    state.countryData.regionsLoading ||
    state.countryData.subRegionsLoading ||
    state.areas.loading ||
    state.whitelists.loading);
export const selectLoadingMeta = (state) =>
  state.geostore &&
  state.geodescriber &&
  (state.geostore.loading || state.geodescriber.loading);
export const selectCountryData = (state) => state.countryData;
export const selectPolynameWhitelist = (state) =>
  state.whitelists && state.whitelists.data;
export const selectEmbed = (state, { embed }) => embed;
export const selectSimple = (state, { simple }) => simple;
export const selectAnalysis = (state, { analysis }) => analysis;
export const selectCategory = (state) =>
  state.location && state.location.query && state.location.query.category;
export const selectModalClosing = (state) =>
  state.modalMeta && state.modalMeta.closing;
export const selectNonGlobalDatasets = (state) =>
  state.widgets && state.widgets.data.nonGlobalDatasets;
const selectDatasets = (state) => state.datasets && state.datasets.data;
const selectLayerTimestamps = (state) =>
  state.datasets && state.datasets.timestamps;

export const getLocationObj = createSelector([getDataLocation], (location) => {
  return {
    ...location,
    adminLevel: locationLevelToStr(location),
  };
});

export const getAllLocationData = createSelector(
  [getDataLocation, selectCountryData, selectRouteType, selectLocationQuery],
  (dataLocation, countryData, routeType, query) => {
    if (isEmpty(countryData)) return null;
    const { type, adm0, adm1 } = dataLocation;

    if (type !== "country") return {};

    return {
      adm0: countryData.countries.map((l) => ({
        ...l,
        path: getLocationPath(routeType, type, query, { adm0: l.value }),
      })),
      adm1: countryData.regions.map((l) => ({
        ...l,
        path: getLocationPath(routeType, type, query, {
          adm0,
          adm1: l.value,
        }),
      })),
      adm2: countryData.subRegions.map((l) => ({
        ...l,
        path: getLocationPath(routeType, type, query, {
          adm0,
          adm1,
          adm2: l.value,
        }),
      })),
    };
  }
);

export const getLocationData = createSelector(
  [getLocationObj, getAllLocationData, selectPolynameWhitelist],
  (locationObj, allLocationData, polynamesWhitelist) => {
    const { type, adminLevel, locationLabel, adm0, adm1, areaId } = locationObj;
    const {
      adm0: adm0Data,
      adm1: adm1Data,
      adm2: adm2Data,
    } = allLocationData || {};

    let parent = {};
    let parentData = adm0Data;
    let children = adm0Data;
    if (adminLevel === "adm1") {
      parent = adm0Data && adm0Data.find((d) => d.value === adm0);
      parentData = adm0Data;
      children = adm2Data;
    } else if (adminLevel === "adm2") {
      parent = adm1Data && adm1Data.find((d) => d.value === adm1);
      parentData = adm1Data;
      children = [];
    }

    const locationData = allLocationData?.[adminLevel] || adm0Data;

    const currentLocation =
      locationData &&
      locationObj &&
      locationData.find(
        (d) =>
          d.value === locationObj[adminLevel] ||
          (d.id && d.id === locationObj.areaId)
      );

    const status = ["country"].includes(locationObj.type)
      ? "saved"
      : (currentLocation && currentLocation.status) || "pending";

    return {
      parent,
      parentLabel: parent && parent.label,
      parentData: parentData && buildLocationDict(parentData),
      location: currentLocation,
      locationData: locationData && buildLocationDict(locationData),
      locationLabel:
        ["geostore", "use"].includes(type) || areaId
          ? locationLabel
          : currentLocation && currentLocation.label,
      childData: children && buildLocationDict(children),
      polynamesWhitelist,
      status,
    };
  }
);

export const getDatasetLayersWithAnalysis = createSelector(
  [selectDatasets],
  (datasets) => {
    return datasets.reduce((all, dataset) => {
      const layers =
        (dataset.layers &&
          dataset.layers.filter(
            (l) =>
              !isEmpty(l.analysisConfig) || !isEmpty(l.timeseriesAnalysisConfig)
          )) ||
        [];

      return all.concat(layers);
    }, []);
  }
);

export const getTimeseriesLayerWidgets = createSelector(
  [getActiveLayers, getLocationObj],
  (activeLayers, locationObj) => {
    const { type: locationType } = locationObj;

    const widgets = activeLayers.reduce((all, layer) => {
      if (layer.hasTimeseriesAnalysis) {
        let analysis = layer.analysisConfig.pointTimeseriesAnalysis || {};

        if (locationType !== "point") {
          analysis = layer.analysisConfig.areaTimeseriesAnalysis || {};
        }

        const { config = {}, unit, aggregationMethod } = analysis || {};

        if (config && config.widget) {
          all[config.widget] = {
            ...getTimeseriesWidget(config),
            unit,
            aggregationMethod,
            isTimeseriesAnalysis: true,
          };
        }
      }

      return all;
    }, {});

    return widgets;
  }
);

export const filterWidgetsByLocation = createSelector(
  [
    getLocationObj,
    getLocationData,
    selectEmbed,
    selectActiveWidget,
    getDatasetLayersWithAnalysis,
    getActiveLayers,
    selectAnalysis,
    getTimeseriesLayerWidgets,
  ],
  (
    location,
    locationData,
    embed,
    widget,
    analysisLayers,
    activeLayers,
    showAnalysis,
    timeseriesWidgets
  ) => {
    const { adminLevel, type, adm0, adm1, areaId } = location;

    const allWidgets = { ...timeseriesWidgets, ...customWidgets };

    // map colors to widgets
    const widgets = Object.values(allWidgets).map((w) => {
      return {
        ...w,
        ...(w.colors && {
          colors: colors[w.colors],
        }),
      };
    });

    if (embed && widget) return widgets.filter((w) => w.widget === widget);

    const layersWithAnalysis =
      showAnalysis &&
      Object.keys(timeseriesWidgets).map((key) => {
        const w = timeseriesWidgets[key];

        return {
          id: w.layerId,
          dataset: w.datasetId,
        };
      });

    const datasetIds =
      layersWithAnalysis && layersWithAnalysis.map((l) => l.dataset);

    const widgets_ = widgets.filter((w) => {
      const { types, admins, datasets, visible, isTimeseriesAnalysis } =
        w || {};

      const { status } = locationData || {};

      const datasetIntersection =
        datasets &&
        intersection(
          compact(datasets.filter((d) => !d.boundary).map((d) => d.dataset)),
          datasetIds
        );

      const widgetLayers =
        datasetIntersection &&
        flatMap(
          datasetIntersection.map((d) => {
            const layers = layersWithAnalysis.filter((l) => l.dataset === d);
            return layers && layers.map((l) => l.id);
          })
        );

      if (widgetLayers) {
        w.layers = widgetLayers;
      }

      const hasLocation =
        types &&
        types.includes(areaId && status === "saved" ? "aoi" : type) &&
        admins &&
        admins.includes(adminLevel);

      // widget visible in admin or dashboard
      const isWidgetVisible =
        (!showAnalysis && !visible) ||
        (showAnalysis &&
          visible &&
          visible.includes("analysis") &&
          !isEmpty(datasetIntersection)) ||
        (!showAnalysis &&
          visible &&
          visible.includes("dashboard") &&
          !isEmpty(datasetIntersection));

      return hasLocation && isWidgetVisible;
    });

    return widgets_;
  }
);

export const getWidgets = createSelector(
  [
    filterWidgetsByLocation,
    getLocationObj,
    getLocationData,
    selectWidgetsData,
    selectWidgetSettings,
    selectWidgetInteractions,
    selectLocationSearch,
    getDatasetLayersWithAnalysis,
    getActiveLayers,
    selectAnalysis,
    selectActiveWidget,
    selectLayerTimestamps,
  ],
  (
    widgets,
    locationObj,
    locationData,
    widgetsData,
    widgetSettings,
    interactions,
    search,
    layers,
    activeLayers,
    analysis,
    activeWidgetKey,
    layerTimestamps
  ) => {
    if (isEmpty(widgets) || !locationObj || !widgetsData) {
      return null;
    }

    const { locationLabelFull, type, adm0, adm1, adm2 } = locationObj || {};

    const { status } = locationData || {};

    const analysisWidgets = widgets.map((w, index) => {
      const {
        settings: defaultSettings,
        widget,
        settingsConfig,
        pendingKeys,
        title: titleTemplate,
        dataType,
      } = w || {};

      const active =
        (!activeWidgetKey && index === 0) || activeWidgetKey === widget;

      // data for widget
      const rawData = widgetsData && widgetsData[widget];

      // const { settings: dataSettings } = rawData || {};

      // layer matching widget
      let widgetLayer =
        layers &&
        layers.find((l) => w.layers && flatMap(w.layers).includes(l.id));

      if (
        widgetLayer &&
        activeLayers &&
        activeLayers.find((l) => l.id === widgetLayer.id)
      ) {
        widgetLayer = activeLayers.find((l) => l.id === widgetLayer.id);
      }

      const { params: layerParams } = widgetLayer || {};

      const widgetQuerySettings = widgetSettings && widgetSettings[widget];
      const widgetInteraction = interactions && interactions[widget];

      const layerSettings = {
        ...layerParams,
      };

      const timestamps =
        (widgetLayer && layerTimestamps && layerTimestamps[widgetLayer.id]) ||
        [];

      // get initial settings from layer layer params if a widget setting is initally empty
      // we might need to refactor this if we can have not empty params
      const initializedDefaultSettings =
        defaultSettings &&
        Object.keys(defaultSettings).reduce((all, s) => {
          if (defaultSettings[s] === "" && layerParams && layerParams[s]) {
            all[s] = layerParams[s];
          } else {
            all[s] = defaultSettings[s];
          }
          return all;
        }, {});

      const mergedSettings = {
        ...initializedDefaultSettings,
        ...widgetQuerySettings,
        ...(analysis && {
          ...layerSettings,
        }),
      };

      const settings = {
        ...mergedSettings,
      };

      const { paramsSelectorConfig } = widgetLayer || [];

      // get data options from layer configuration
      const dataOptions =
        paramsSelectorConfig &&
        paramsSelectorConfig.reduce((all, item) => {
          if (item.key && item.options) {
            all[item.key] = item.options;
          }
          return all;
        }, {});

      const settingsConfigParsed = getSettingsConfig({
        settingsConfig,
        dataOptions,
        settings,
        status,
        pendingKeys,
      });

      const optionsSelected =
        settingsConfigParsed && getOptionsSelected(settingsConfigParsed);

      const settingsConfigFiltered = settingsConfigParsed;

      // const props = {
      //   ...w,
      //   ...locationObj,
      //   ...locationData,
      //   active,
      //   data: rawData,
      //   settings,
      //   title: titleTemplate,
      //   settingsConfig: settingsConfigFiltered,
      //   optionsSelected,
      // };

      const props = {
        ...w,
        ...locationObj,
        ...locationData,
        locationType: locationObj?.locationType,
        active,
        data: rawData,
        settings,
        interaction: widgetInteraction,
        title: titleTemplate,
        settingsConfig: settingsConfigFiltered,
        optionsSelected,
        timestamps: timestamps,
      };

      const parsedProps = props.getWidgetProps && props.getWidgetProps(props);
      const { title: parsedTitle } = parsedProps || {};
      const title = parsedTitle || titleTemplate;

      const downloadLink =
        props.getDownloadLink &&
        props.getDownloadLink({ ...props, ...parsedProps });

      const searchObject = qs.parse(search);
      const widgetQuery = searchObject && searchObject[widget];
      const shareUrl =
        !isServer &&
        `${window.location.origin}${window.location.pathname}?${
          searchObject
            ? qs.stringify({
                ...searchObject,
                widget,
                showMap: false,
                scrollTo: widget,
              })
            : ""
        }`;

      return {
        ...props,
        ...parsedProps,
        shareUrl,
        // embedUrl,
        downloadLink,
        rawData,
        title: title
          ? translateText(title)?.replace(
              "{location}",
              locationLabelFull || "..."
            )
          : "",
      };
    });

    return analysisWidgets;
  }
);

export const getActiveWidget = createSelector(
  [getWidgets, selectActiveWidget, selectAnalysis],
  (widgets, activeWidgetKey, analysis) => {
    if (!widgets || analysis) return null;
    if (!activeWidgetKey) return widgets[0];

    const activeWidgets = widgets.find((w) => w.widget === activeWidgetKey);

    return activeWidgets;
  }
);

export const getNoDataMessage = createSelector([], () => {
  return "No data available";
});

export const getWidgetsProps = () =>
  createStructuredSelector({
    loadingData: selectLoadingFilterData,
    loadingMeta: selectLoadingMeta,
    widgets: getWidgets,
    activeWidget: getActiveWidget,
    location: getDataLocation,
    embed: selectEmbed,
    simple: selectSimple,
    modalClosing: selectModalClosing,
    noDataMessage: getNoDataMessage,
    geostore: selectGeostore,
    isAnalysis: selectAnalysis,
  });
