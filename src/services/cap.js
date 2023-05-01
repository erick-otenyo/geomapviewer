import request from "@/utils/request";
import slugify from "slugify";
import isPlainObject from "lodash/isPlainObject";
import * as txml from "txml";
import rewind from "@mapbox/geojson-rewind";

const standardizeCap = (capJson) => {
  return Object.keys(capJson).reduce((all, key) => {
    if (key.startsWith("cap:")) {
      const itemKey = key.slice(4);
      if (isPlainObject(capJson[key])) {
        all[itemKey] = standardizeCap(capJson[key]);
      } else {
        all[itemKey] = capJson[key];
      }
    } else {
      all[key] = capJson[key];
    }
    return all;
  }, {});
};

const getPolygonFeature = (aletId, areaItem) => {
  const polygon = areaItem.polygon.split(" ");

  const tmpCList = [];
  for (let j = 0; j < polygon.length; j++) {
    let tmpC = polygon[j].split(",");

    const tmp = tmpC[1];
    tmpC[1] = parseFloat(tmpC[0]);
    tmpC[0] = parseFloat(tmp);

    tmpCList.push(tmpC);
  }

  var tmp_polygon = {
    type: "Feature",
    id: `${aletId}-${areaItem.areaDesc ? slugify(areaItem.areaDesc) : i}`,
    geometry: {
      type: "Polygon",
      coordinates: [tmpCList],
    },
    properties: { areaDesc: areaItem.areaDesc },
  };

  return tmp_polygon;
};

const getFeatureCollection = (alert) => {
  const { info: alertInfo } = alert;

  const areas = [];

  if (Array.isArray(alertInfo)) {
    alertInfo.forEach((info) => {
      const { area } = info;

      if (Array.isArray(area)) {
        areas.push(...area);
      } else {
        areas.push(area);
      }
    });
  } else {
    const { area } = alertInfo;
    if (Array.isArray(area)) {
      areas.push(...area);
    } else {
      areas.push(area);
    }
  }

  let featureColl = {
    type: "FeatureCollection",
    features: [],
    id: alert.identifier,
  };

  if (areas && !!areas.length) {
    for (let i = 0; i < areas.length; i++) {
      const areaItem = areas[i];

      if (areaItem.polygon) {
        const polygonFeature = getPolygonFeature(alert.identifier, areaItem);

        featureColl.features.push(polygonFeature);
      }
    }
  }

  featureColl = rewind(featureColl, false);

  return featureColl;
};

export const getCapAlerts = (capBaseUrl) => {
  return request
    .get(capBaseUrl)
    .then((res) => res.data)
    .then((xml) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      const alerts = xmlDoc.getElementsByTagName("alert");

      const featureCollection = {
        type: "FeatureCollection",
        features: [],
      };

      Array.from(alerts).forEach(function (alert) {
        const alertData = parseCap(alert.outerHTML);

        const { info, ...rest } = alertData;
        const {
          area: { features },
          ...alertDetail
        } = info;

        features.forEach((feature) => {
          featureCollection.features.push({
            ...feature,
            properties: { ...feature.properties, ...rest, ...alertDetail },
          });
        });
      });

      return featureCollection;
    });
};

export const getCapDetail = (capUrl) => {
  return request.get(capUrl).then((res) => {
    const capXmlData = res.data;
    return { capUrl, alert: parseCap(capXmlData) };
  });
};

const parseCap = (xml) => {
  const capJsonData = txml.parse(xml, { simplify: true });

  const standardCapJsonData = standardizeCap(capJsonData);

  const alert = standardCapJsonData.alert;

  const featureColl = getFeatureCollection(alert);

  if (Array.isArray(alert.info)) {
    alert.info = alert.info[0];
  }

  alert.info.area = featureColl;

  // remove unnecessary properties
  // delete alert._attributes;
  // delete alert.info.area;
  // delete alert.info.circle;
  // delete alert.info.polygon;

  return alert;
};
