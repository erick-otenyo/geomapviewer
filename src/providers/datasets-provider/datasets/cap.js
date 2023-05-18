import { getCapAlertsGeojson } from "@/services/cap";

export const createCapDataset = (capConfig) => {
  const { category, subCategory, baseUrl, initialVisible, metadata } = capConfig || {};

  const canShow = !!(category && subCategory && baseUrl);

  if (!canShow) {
    return [];
  }

  const datasets = [
    {
      id: "cap_alerts",
      dataset: "cap_alerts",
      name: "Weather Alerts",
      layer: "cap_alerts",
      initialVisible: initialVisible,
      isCapAlert: true,
      metadata: metadata,
      category: category,
      sub_category: subCategory,
      capabilities: ["nearRealTime"],
      capConfig: capConfig,
      layers: [
        {
          id: "cap_alerts",
          dataset: "cap_alerts",
          name: "Weather Alerts",
          type: "layer",
          layerConfig: {
            type: "vector",
            source: {
              type: "geojson",
              data: { type: "FeatureCollection", features: [] },
            },
            render: {
              layers: [
                {
                  paint: {
                    "fill-color": [
                      "match",
                      ["get", "severity"], // get the property
                      "Extreme",
                      "#d72f2a",
                      "Severe",
                      "#fe9900",
                      "Moderate",
                      "#ffff00",
                      "Minor",
                      "#03ffff",
                      "#3366ff",
                    ],
                    "fill-opacity": 1,
                  },
                  type: "fill",
                  filter: [
                    "in",
                    ["get", "severity"],
                    ["literal", ["Extreme", "Severe", "Moderate", "Minor"]],
                  ],
                },
                {
                  paint: {
                    "line-color": [
                      "match",
                      ["get", "severity"], // get the property
                      "Extreme",
                      "#ac2420",
                      "Severe",
                      "#ca7a00",
                      "Moderate",
                      "#cbcb00",
                      "Minor",
                      "#00cdcd",
                      "#003df4",
                    ],
                    "line-width": 0.1,
                  },
                  type: "line",
                  filter: [
                    "in",
                    ["get", "severity"],
                    ["literal", ["Extreme", "Severe", "Moderate", "Minor"]],
                  ],
                },
              ],
            },
          },
          layerFilterParams: {
            severity: [
              { label: "Extreme", value: "Extreme" },
              { label: "Severe", value: "Severe" },
              { label: "Moderate", value: "Moderate" },
              { label: "Minor", value: "Minor" },
            ],
          },
          layerFilterParamsConfig: [
            {
              isMulti: true,
              type: "checkbox",
              key: "severity",
              required: true,
              default: [
                { label: "Extreme", value: "Extreme" },
                { label: "Severe", value: "Severe" },
                { label: "Moderate", value: "Moderate" },
              ],
              sentence: "Filter by Severity {selector}",
              options: [
                { label: "Extreme", value: "Extreme" },
                { label: "Severe", value: "Severe" },
                { label: "Moderate", value: "Moderate" },
                { label: "Minor", value: "Minor" },
                { label: "Unknown", value: "Unknown" },
              ],
            },
          ],
          legendConfig: {
            items: [
              {
                color: "#d72f2a",
                name: "Extreme Severity",
              },
              {
                color: "#fe9900",
                name: "Severe Severity",
              },
              {
                color: "#ffff00",
                name: "Moderate Severity",
              },
              {
                color: "#03ffff",
                name: "Minor Severity",
              },
              {
                color: "#3366ff",
                name: "Unknown Severity",
              },
            ],
            type: "basic",
          },
          interactionConfig: {
            capAlert: true,
            type: "intersection",
          },
        },
      ],
    },
  ];

  return datasets;
};

export const createCapUpdateProvider = (capConfig) => {
  const { baseUrl, refreshInterval } = capConfig;
  const updates = [
    {
      layer: "cap_alerts",
      getData: async (token) => {
        return getCapAlertsGeojson(baseUrl);
      },
      ...(!!refreshInterval && {
        updateInterval: refreshInterval,
      }),
    },
  ];

  return updates;
};
