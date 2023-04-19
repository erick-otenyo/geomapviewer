const datasets = [
  {
    id: "political-boundaries",
    dataset: "political-boundaries",
    name: "Political Boundaries",
    layer: "political-boundaries",
    isBoundary: true,
    layers: [
      {
        isBoundary: true,
        analysisEndpoint: "admin",
        tableName: "pgadapter.africa_gadm36_political_boundaries",
        name: "Political Boundaries",
        id: "political-boundaries",
        type: "layer",
        description: "Africa Boundaries",
        provider: "geojson",
        default: true,
        layerConfig: {
          type: "vector",
          source: {
            tiles: [
              "http://20.56.94.119/pg4w/tileserv/pgadapter.africa_gadm36_political_boundaries/{z}/{x}/{y}.pbf?properties=gid_0,gid_1,gid_2,name_0,name_1,name_2,level,area,gid,size",
            ],
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
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "huge"], ["==", "level", 0]],
                maxzoom: 3,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "very big"], ["==", "level", 0]],
                maxzoom: 4,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "big"], ["==", "level", 0]],
                maxzoom: 5,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "medium"], ["==", "level", 0]],
                maxzoom: 6,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "small"], ["==", "level", 0]],
                maxzoom: 7,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: [
                  "all",
                  ["==", "size", "very small"],
                  ["==", "level", 0],
                ],
                maxzoom: 8,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "huge"], ["==", "level", 1]],
                maxzoom: 5,
                minzoom: 3,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "very big"], ["==", "level", 1]],
                maxzoom: 6,
                minzoom: 4,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "big"], ["==", "level", 1]],
                maxzoom: 7,
                minzoom: 5,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "medium"], ["==", "level", 1]],
                maxzoom: 8,
                minzoom: 6,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "small"], ["==", "level", 1]],
                maxzoom: 8,
                minzoom: 7,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: [
                  "all",
                  ["==", "size", "very small"],
                  ["==", "level", 1],
                ],
                maxzoom: 9,
                minzoom: 8,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "huge"], ["==", "level", 2]],
                minzoom: 5,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "very big"], ["==", "level", 2]],
                minzoom: 6,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "big"], ["==", "level", 2]],
                minzoom: 7,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "medium"], ["==", "level", 2]],
                minzoom: 8,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["all", ["==", "size", "small"], ["==", "level", 2]],
                minzoom: 8,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: [
                  "all",
                  ["==", "size", "very small"],
                  ["==", "level", 2],
                ],
                minzoom: 9,
                paint: {
                  "fill-color": "#ffffff",
                  "fill-opacity": 0,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "fill",
              },
              {
                filter: ["==", "level", 0],
                maxzoom: 4,
                paint: {
                  "line-color": "#7f7f7f",
                  "line-width": 1.5,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "huge"], ["==", "level", 0]],
                maxzoom: 3,
                paint: {
                  "line-color": "#7f7f7f",
                  "line-width": 1.5,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "very big"], ["==", "level", 0]],
                maxzoom: 4,
                paint: {
                  "line-color": "#7f7f7f",
                  "line-width": 1.5,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "big"], ["==", "level", 0]],
                maxzoom: 5,
                paint: {
                  "line-color": "#7f7f7f",
                  "line-width": 1.5,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "medium"], ["==", "level", 0]],
                maxzoom: 6,
                paint: {
                  "line-color": "#7f7f7f",
                  "line-width": 1.5,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "small"], ["==", "level", 0]],
                maxzoom: 7,
                paint: {
                  "line-color": "#7f7f7f",
                  "line-width": 1.5,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: [
                  "all",
                  ["==", "size", "very small"],
                  ["==", "level", 0],
                ],
                maxzoom: 8,
                paint: {
                  "line-color": "#7f7f7f",
                  "line-width": 1.5,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "huge"], ["==", "level", 1]],
                maxzoom: 5,
                minzoom: 3,
                paint: {
                  "line-color": "#8b8b8b",
                  "line-width": 1,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "very big"], ["==", "level", 1]],
                maxzoom: 6,
                minzoom: 4,
                paint: {
                  "line-color": "#8b8b8b",
                  "line-width": 1,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "big"], ["==", "level", 1]],
                maxzoom: 7,
                minzoom: 5,
                paint: {
                  "line-color": "#8b8b8b",
                  "line-width": 1,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "medium"], ["==", "level", 1]],
                maxzoom: 8,
                minzoom: 6,
                paint: {
                  "line-color": "#8b8b8b",
                  "line-width": 1,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "small"], ["==", "level", 1]],
                maxzoom: 8,
                minzoom: 7,
                paint: {
                  "line-color": "#8b8b8b",
                  "line-width": 1,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: [
                  "all",
                  ["==", "size", "very small"],
                  ["==", "level", 1],
                ],
                maxzoom: 9,
                minzoom: 8,
                paint: {
                  "line-color": "#8b8b8b",
                  "line-width": 1,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "huge"], ["==", "level", 2]],
                minzoom: 5,
                paint: {
                  "line-color": "#444444",
                  "line-dasharray": [2, 4],
                  "line-width": 0.7,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "very big"], ["==", "level", 2]],
                minzoom: 6,
                paint: {
                  "line-color": "#444444",
                  "line-dasharray": [2, 4],
                  "line-width": 0.7,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "big"], ["==", "level", 2]],
                minzoom: 7,
                paint: {
                  "line-color": "#444444",
                  "line-dasharray": [2, 4],
                  "line-width": 0.7,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "medium"], ["==", "level", 2]],
                minzoom: 8,
                paint: {
                  "line-color": "#444444",
                  "line-dasharray": [2, 4],
                  "line-width": 0.7,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: ["all", ["==", "size", "small"], ["==", "level", 2]],
                minzoom: 8,
                paint: {
                  "line-color": "#444444",
                  "line-dasharray": [2, 4],
                  "line-width": 0.7,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
                type: "line",
              },
              {
                filter: [
                  "all",
                  ["==", "size", "very small"],
                  ["==", "level", 2],
                ],
                minzoom: 9,
                paint: {
                  "line-color": "#444444",
                  "line-dasharray": [2, 4],
                  "line-width": 0.7,
                },
                "source-layer": "pgadapter.africa_gadm36_political_boundaries",
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

export default { datasets };
