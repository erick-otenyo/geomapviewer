import defaultImage from "./images/default.png";
import darkImage from "./images/dark.png";
import satelliteImage from "./images/satellite.png";

export default {
  default: {
    label: "default",
    value: "default",
    baseStyle: true,
    backgroundColor: "#A2DFFF",
    image: defaultImage,
    hasSettings: false,
    basemapGroup: "basemap-light",
    labelsGroup: "labels-light",
    mapStyle: "http://20.56.94.119/tileserver-gl/styles/ahw/style.json",
  },
  dark: {
    label: "dark matter",
    value: "dark",
    color: "#31312F",
    baseStyle: true,
    image: darkImage,
    hasSettings: false,
    basemapGroup: "basemap-dark",
    labelsGroup: "labels-dark",
    mapStyle: "http://20.56.94.119/tileserver-gl/styles/ahw/style.json",
  },
  satellite: {
    label: "satellite",
    description: "Highest resolution imagery 1-3 years old (global)",
    value: "satellite",
    color: "#131620",
    baseStyle: true,
    hasSettings: false,
    infoModal: "satellite_basemap",
    image: satelliteImage,
    basemapGroup: "basemap-satellite",
    labelsGroup: "labels-dark",
    mapStyle: "http://20.56.94.119/tileserver-gl/styles/ahw/style.json",
    url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  },
  defaultWithLabels: {
    label: "Default With Labels",
    description: "Default Basemap with Lables",
    value: "default_with_labels",
    color: "#131620",
    baseStyle: false,
    hasSettings: false,
    mapStyle:
      "http://20.56.94.119/tileserver-gl/styles/basemap_with_labels/style.json",
  },
  basicWithLabels: {
    label: "Basic With Labels",
    description: "Basic Basemap with Lables",
    value: "basic_with_labels",
    color: "#131620",
    baseStyle: false,
    hasSettings: false,
    mapStyle: "http://20.56.94.119/tileserver-gl/styles/basic/style.json",
  },
};
