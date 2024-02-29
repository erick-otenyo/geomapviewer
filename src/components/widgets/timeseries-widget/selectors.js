import { createSelector, createStructuredSelector } from "reselect";
import { parseISO, format } from "date-fns";
import {
  formatNumber as utilFormatNumber,
  formatDateTime,
} from "@/utils/format";

import {
  gskyWpsDataByYear,
  gskyWpsDataByMonthNo,
  gskyWpsDataByPentadNo,
} from "@/utils/data";

import { getPentadFromDateString } from "@/utils/date-format";

const getSettings = (state) => state.settings;
const getData = (state) => state.data && state.data;
const getPlotConfig = (state) => state.plotConfig;
const getColors = (state) => state.colors;

export const getColor = (val, inverse) => {
  if (inverse) {
    if (val > 0) {
      return "#4582b5";
    }

    return "#c82808";
  }

  if (val > 0) {
    return "#c82808";
  }

  return "#4582b5";
};

export const parseData = createSelector(
  [getSettings, getData, getPlotConfig],
  (settings, data, plotConfig) => {
    const {
      byYear,
      isAnomaly,
      inverseAnomalyColor,
      byCurrentDataMonth,
      byCurrentDataPentad,
    } = plotConfig;

    const { time } = settings;

    if (!data) return null;

    let plotData = data;

    if (byYear) {
      plotData = gskyWpsDataByYear(data);
    } else if (byCurrentDataMonth && time) {
      const month = parseISO(time).getMonth() + 1;
      plotData = gskyWpsDataByMonthNo(data, month);
    } else if (byCurrentDataPentad && time) {
      const [pentad] = getPentadFromDateString(time);
      plotData = gskyWpsDataByPentadNo(data, pentad);
    }

    if (isAnomaly) {
      plotData = plotData.map((c) => ({
        ...c,
        color: getColor(c.value, inverseAnomalyColor),
      }));
    }

    return plotData;
  }
);

const parseConfig = createSelector(
  [getPlotConfig, getColors],
  (plotConfig, colors) => {
    const { tooltip, xAxis, ...rest } = plotConfig;

    const config = {
      ...rest,
    };

    if (tooltip) {
      const tooltipConfig = tooltip.map((t) => {
        const { formatConfig, ...restTConfig } = t;

        const tConfig = { ...restTConfig };

        if (formatConfig) {
          const { formatNumber, formatDate, dateFormat, units } = formatConfig;

          if (formatNumber) {
            tConfig.unitFormat = (value) => {
              return utilFormatNumber({ num: value, unit: units });
            };
          }

          if (formatDate && dateFormat) {
            tConfig.unitFormat = (value) => {
              return value && formatDateTime(value, dateFormat);
            };
          }
        }

        return tConfig;
      });

      config.tooltip = tooltipConfig;
    }

    if (xAxis && xAxis.tickDateFormat) {
      const xAxisConfig = { ...xAxis };

      xAxisConfig.tickFormatter = (date) =>
        format(parseISO(date), xAxis.tickDateFormat);

      config.xAxis = xAxisConfig;
    }

    return config;
  }
);

const parseSentence = createSelector([parseData], (data, settings) => {
  return {};
});

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
});
