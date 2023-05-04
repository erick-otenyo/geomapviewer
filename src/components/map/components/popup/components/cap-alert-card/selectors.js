import { createSelector, createStructuredSelector } from "reselect";
import { parseISO, format } from "date-fns";

const getInteractionData = (state, { data }) => data;

export const SEVERITY_MAPPING = {
  Extreme: {
    color: "#d72f2a",
    name: "Extreme",
    value: "Extreme",
  },
  Severe: {
    color: "#fe9900",
    name: "Severe",
    value: "Severe",
  },
  Moderate: {
    color: "#ffff00",
    fontColor: "#000",
    name: "Moderate",
    value: "Moderate",
  },
  Minor: {
    color: "#03ffff",
    fontColor: "#000",
    name: "Minor",
    value: "Minor",
  },
  Unknown: {
    color: "#3366ff",
    name: "Unknown",
    value: "Unknown",
  },
};

export const URGENCY_MAPPING = {
  Immediate: {
    name: "Immediate",
    value: "Immediate",
  },
  Expected: {
    name: "Expected",
    value: "Expected",
  },
  Future: {
    name: "Future",
    value: "Future",
  },
  Past: {
    name: "Past",
    value: "Past",
  },
  Unknown: {
    name: "Unknown",
    value: "Unknown",
  },
};

export const CERTAINTY_MAPPING = {
  Observed: {
    name: "Observed",
    value: "Observed",
  },
  Likely: {
    name: "Likely",
    value: "Likely",
  },
  Possible: {
    name: "Possible",
    value: "Possible",
  },
  Unlikely: {
    name: "Unlikely",
    value: "Unlikely",
  },
  uknown: {
    name: "Unknown",
    value: "Unknown",
  },
};

const MAPPING_FIELDS = {
  severity: SEVERITY_MAPPING,
  urgency: URGENCY_MAPPING,
  certainty: CERTAINTY_MAPPING,
};

export const getCardData = createSelector(
  [getInteractionData],
  (interaction = {}) => {
    const { data, layer } = interaction;

    const { interactionConfig } = layer || {};

    const properties = interactionConfig && data.properties;

    const capData = {
      ...properties,
    };

    Object.keys(capData).forEach((key) => {
      if (MAPPING_FIELDS[key] && MAPPING_FIELDS[key][capData[key]]) {
        capData[key] = MAPPING_FIELDS[key][capData[key]];
      }

      if (key === "onset" || key === "expires") {
        const isoDate = parseISO(capData[key]);
        capData[key] = format(isoDate, "yyyy-mm-dd HH:MM") + " UTC";
      }
    });

    const { web } = capData;

    const buttons = web
      ? [
          {
            text: "MORE DETAILS",
            extLink: web,
            theme: `theme-button-small`,
          },
        ]
      : [];

    const category = capData.severity;

    const tagConfig = {
      tag: category.name,
      tagColor: category.color,
      tagFontColor: category.fontColor && category.fontColor,
    };

    return {
      ...capData,
      ...tagConfig,
      buttons,
    };
  }
);

export const getCapAlertCardProps = createStructuredSelector({
  data: getCardData,
});
