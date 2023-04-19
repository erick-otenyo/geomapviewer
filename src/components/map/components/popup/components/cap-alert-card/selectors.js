import { createSelector, createStructuredSelector } from "reselect";
import moment from "moment";

const getInteractionData = (state, { data }) => data;

export const SEVERITY_MAPPING = {
  4: {
    color: "#d72f2a",
    name: "Extreme",
    value: 4,
  },
  3: {
    color: "#fe9900",
    name: "Severe",
    value: 3,
  },
  2: {
    color: "#ffff00",
    fontColor: "#000",
    name: "Moderate",
    value: 2,
  },
  1: {
    color: "#03ffff",
    fontColor: "#000",
    name: "Minor",
    value: 1,
  },
  uknown: {
    color: "#3366ff",
    name: "Unknown",
    value: 0,
  },
};

export const URGENCY_MAPPING = {
  4: {
    name: "Immediate",
    value: 4,
  },
  3: {
    name: "Expected",
    value: 3,
  },
  2: {
    name: "Future",
    value: 2,
  },
  1: {
    name: "Past",
    value: 1,
  },
  uknown: {
    name: "Unknown",
    value: 0,
  },
};

export const CERTAINTY_MAPPING = {
  4: {
    name: "Observed",
    value: 4,
  },
  3: {
    name: "Likely",
    value: 3,
  },
  2: {
    name: "Possible",
    value: 2,
  },
  1: {
    name: "Unlikely",
    value: 1,
  },
  uknown: {
    name: "Unknown",
    value: 0,
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

      if (key === "event") {
        const eventData = capData[key].split("^");

        capData["event"] = eventData[0];

        capData["eventSentTime"] = eventData[2].length;

        capData["eventSent"] =
          !!eventData[2].length && capData["utc"]
            ? moment(eventData[2]).from(capData["utc"])
            : "";
      }
    });

    const category = capData.severity;

    const tagConfig = {
      tag: category.name,
      tagColor: category.color,
      tagFontColor: category.fontColor && category.fontColor,
    };

    if (capData && capData.alertDetail) {
      capData.alertDetail = JSON.parse(capData.alertDetail);
    }

    const sourceInfo = capData && capData.sourceInfo;

    if (sourceInfo) {
      capData.sourceInfo = JSON.parse(sourceInfo);
    }

    const { website } = (capData.sourceInfo && capData.sourceInfo) || {};

    const buttons =
      capData && capData.link
        ? [
            {
              text: "DETAILS",
              extLink: `/cap/?capUrl=${capData.link}&section=detail`,
              theme: `theme-button-small`,
            },
          ]
        : [];

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
