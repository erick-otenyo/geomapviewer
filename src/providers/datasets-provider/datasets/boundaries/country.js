const getCountryBoundaryDataset = (tilesUrl, sourceLayer) => {
  const datasets = [
    {
      id: "political-boundaries",
      dataset: "political-boundaries",
      name: "Political Boundaries",
      layer: "political-boundaries",
      isBoundary: true,
      public: true,
      layers: [
        {
          isBoundary: true,
          analysisEndpoint: "admin",
          name: "Political Boundaries",
          id: "political-boundaries",
          default: true,
          layerConfig: {
            type: "vector",
            source: {
              tiles: [tilesUrl],
              type: "vector",
            },
            render: {
              layers: [
                {
                  filter: ["==", "level", 0],
                  maxzoom: 3,
                  paint: {
                    "fill-color": "#ffffff",
                    "fill-opacity": 0,
                  },
                  "source-layer": sourceLayer,
                  type: "fill",
                },
                {
                  filter: ["==", "level", 1],
                  maxzoom: 6,
                  minzoom: 3,
                  paint: {
                    "fill-color": "#ffffff",
                    "fill-opacity": 0,
                  },
                  "source-layer": sourceLayer,
                  type: "fill",
                },
                {
                  filter: ["==", "level", 2],
                  minzoom: 6,
                  paint: {
                    "fill-color": "#ffffff",
                    "fill-opacity": 0,
                  },
                  "source-layer": sourceLayer,
                  type: "fill",
                },
                {
                  filter: ["==", "level", 0],
                  paint: {
                    "line-color": "#C0FF24",
                    "line-width": 1,
                    "line-offset": 1,
                  },
                  "source-layer": sourceLayer,
                  type: "line",
                },
                {
                  filter: ["==", "level", 0],
                  paint: {
                    "line-color": "#000",
                    "line-width": 1.5,
                  },
                  "source-layer": sourceLayer,
                  type: "line",
                },
                {
                  filter: ["==", "level", 1],
                  maxzoom: 6,
                  minzoom: 3,
                  paint: {
                    "line-color": "#8b8b8b",
                    "line-width": 1,
                  },
                  "source-layer": sourceLayer,
                  type: "line",
                },
                {
                  filter: ["==", "level", 2],
                  minzoom: 6,
                  paint: {
                    "line-color": "#444444",
                    "line-dasharray": [2, 4],
                    "line-width": 0.7,
                  },
                  "source-layer": sourceLayer,
                  type: "line",
                },
              ],
            },
          },
          interactionConfig: {
            output: [
              {
                column: "gid_0",
                format: null,
                property: "ISO",
                type: "string",
              },
              {
                column: "gid_1",
                format: null,
                property: "admin1",
                type: "string",
              },
              {
                column: "gid_2",
                format: null,
                property: "admin2",
                type: "string",
              },
              {
                column: "name_0",
                format: null,
                property: "Country",
                type: "string",
              },
              {
                column: "name_1",
                format: null,
                property: "Region",
                type: "string",
              },
              {
                column: "name_2",
                format: null,
                property: "Sub Region",
                type: "string",
              },
              {
                column: "level",
                format: null,
                property: "Admin Level",
                type: "number",
              },
              {
                column: "area",
                format: "0a",
                property: "Area",
                suffix: "ha",
                type: "number",
              },
              {
                column: "gid",
                format: null,
                hidden: true,
                property: "gid",
                type: "number",
              },
            ],
            type: "intersection",
          },
        },
      ],
    },
  ];

  return datasets;
};

export default getCountryBoundaryDataset;
