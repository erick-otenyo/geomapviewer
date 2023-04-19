import sortBy from "lodash/sortBy";

import { encodeQueryParams } from "@/utils/url";

import allOptions from "../options";

export const getSettingsConfig = ({
  settingsConfig,
  settings,
  dataOptions,
  pendingKeys,
  status,
}) =>
  settingsConfig &&
  settingsConfig
    .filter(
      (s) =>
        status !== "pending" ||
        !pendingKeys ||
        (pendingKeys && pendingKeys.includes(s.key))
    )
    .map((o) => {
      const {
        key,
        compareKey,
        startKey,
        endKey,
        options,
        whitelist,
        locationType,
        noSort,
      } = o || {};
      let mergedOptions =
        (dataOptions && dataOptions[key]) || options || allOptions[key];

      const parsedOptions = noSort
        ? mergedOptions
        : sortBy(mergedOptions, "label");

      return {
        ...o,
        ...(parsedOptions && {
          options: parsedOptions.filter(
            (opt) => !whitelist || whitelist.includes(opt.value)
          ),
          value: parsedOptions.find((opt) => opt.value === settings[key]),
          ...(startKey && {
            startOptions: parsedOptions.filter(
              (opt) => opt.value <= settings[endKey]
            ),
            startValue: parsedOptions.find(
              (opt) => opt.value === settings[startKey]
            ),
          }),
          ...(endKey && {
            endOptions: parsedOptions.filter(
              (opt) => opt.value <= settings[endKey]
            ),
            endValue: parsedOptions.find(
              (opt) => opt.value === settings[endKey]
            ),
          }),
          ...(compareKey && {
            compareOptions: parsedOptions.filter(
              (opt) => opt.value !== settings[key]
            ),
            compareValue: parsedOptions.find(
              (opt) => opt.value === settings[compareKey]
            ),
          }),
        }),
        ...(o.type === "datepicker" && {
          ...dataOptions,
          startValue: settings[startKey],
          endValue: settings[endKey],
        }),
      };
    });

export const getOptionsSelected = (options) =>
  options &&
  options.reduce(
    (obj, option) => ({
      ...obj,
      [option.key]: option.options.find((o) => o === option.value),
    }),
    {}
  );

export const getWidgetDatasets = ({
  datasets,
  extentYear,
  startYear,
  endYear,
  year,
}) => {
  return (
    datasets &&
    datasets
      .filter((d) => d.boundary)
      .map((d) => ({
        ...d,
        opacity: 1,
        visibility: true,
        ...(!d.boundary && {
          layers:
            extentYear && !Array.isArray(d.layers)
              ? [d.layers[extentYear]]
              : d.layers,
          ...(((startYear && endYear) || year) && {}),
        }),
      }))
  );
};

export const getLocationPath = (pathname, type, query, params) => {
  const pathObj = {
    payload: {
      type: type === "africa" ? "country" : type,
      ...params,
    },
    query: {
      ...query,
      map: {
        ...(query && query.map),
        canBound: true,
      },
    },
  };

  if (pathObj.query.location) {
    delete pathObj.query.location;
  }

  return {
    href: pathname,
    as: `${pathname.replace(
      "[[...location]]",
      Object.values(pathObj.payload).join("/")
    )}?${encodeQueryParams(pathObj.query)}`,
  };
};
