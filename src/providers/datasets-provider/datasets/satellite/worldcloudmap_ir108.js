import { getLatestDates } from "@/services/live-imagery";

const category = 3;
const subCategory = 3;

const layerId = "mumi:worldcloudmap_ir108";
const name = "Infrared Cloud Imagery";

const datasets = [
  {
    id: layerId,
    dataset: layerId,
    name: name,
    layer: layerId,
    category: category,
    sub_category: subCategory,
    metadata: "",
    isNearRealTime: true,
    citation: "EUMETSAT, Updated every 3 Hours",
    global: true,
    capabilities: ["timeseries", "nearRealTime"],
    layers: [
      {
        name: name,
        id: layerId,
        type: "layer",
        default: true,
        dataset: layerId,
        layerConfig: {
          type: "raster",
          source: {
            type: "raster",
            tiles: [
              `http://20.56.94.119/sat-imagery/metsat/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png8&TRANSPARENT=true&LAYERS=${layerId}&time={time}&STYLES=&tiled=true&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={bbox-epsg-3857}`,
            ],
            minzoom: 3,
            maxzoom: 12,
          },
        },
        params: {
          time: "",
        },
        paramsSelectorConfig: [
          {
            key: "time",
            required: true,
            sentence: "{selector}",
            type: "datetime",
            dateFormat: { currentTime: "yyyy-mm-dd HH:MM" },
            availableDates: [],
          },
        ],
        legendConfig: {},
      },
    ],
  },
];

const updates = [
  {
    layer: layerId,
    getTimestamps: () => {
      return getLatestDates({ layerId }).then((res) => {
        const timestamps = (res.data && res.data.values) || [];
        return timestamps;
      });
    },
    updateInterval: 900000, // every 15 minutes
  },
];

export default { datasets, updates };
