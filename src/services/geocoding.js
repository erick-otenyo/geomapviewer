import { all, spread } from "axios";
import bbox from "@turf/bbox";

import {
  nominatimGeocodingRequest,
  pgFeatureServRequest,
} from "@/utils/request";

import { POLITICAL_BOUNDARIES } from "@/data/layers";

const EA_BBOX = [21.838949, -11.745695, 51.415695, 23.145147];

const parseNominatimRes = (data) =>
  data.map((f) => {
    return {
      ...f,
      source: "nominatim",
      id: POLITICAL_BOUNDARIES,
      bbox: f.bbox,
      center: f.geometry.coordinates,
      place_name: f.properties.display_name,
    };
  });

const parsePgFsRes = (data) =>
  data.map((c) => {
    return {
      ...c,
      source: "pgfeatureserv",
      id: POLITICAL_BOUNDARIES,
      bbox: bbox(JSON.parse(c.bbox)),
      center: JSON.parse(c.centroid)?.coordinates,
    };
  });

export const fetchGeocodePg = (searchQuery = "", lang = "en", cancelToken) => {
  return pgFeatureServRequest
    .get(
      `/functions/africa_admin_by_name/items.json?search_name=${searchQuery}`,
      {
        cancelToken,
      }
    )
    .then((res) => {
      const boundaries = res?.data?.rows && parsePgFsRes(res.data.rows);
      return boundaries;
    })
    .catch(() => {
      return [];
    });
};

export const fetchGeocodeNominatim = (
  searchQuery = "",
  lang = "en",
  cancelToken
) => {
  return nominatimGeocodingRequest
    .get(
      `/search?q=${searchQuery}&format=geojson&&viewbox=${EA_BBOX.toString()}&bounded=1`,
      {
        cancelToken,
      }
    )
    .then((res) => {
      const features =
        res?.data?.features && parseNominatimRes(res.data.features);
      return features;
    })
    .catch((err) => {
      return [];
    });
};

export const fetchGeocodeLocations = (
  searchQuery = "",
  lang = "en",
  cancelToken
) => {
  return all([
    nominatimGeocodingRequest
      .get(
        `/search?q=${searchQuery}&format=geojson&&viewbox=${EA_BBOX.toString()}&bounded=1`,
        {
          cancelToken,
        }
      )
      .then((res) => {
        const features =
          res?.data?.features && parseNominatimRes(res.data.features);
        return features;
      })
      .catch((err) => {
        return [];
      }),
    pgFeatureServRequest
      .get(
        `/functions/africa_admin_by_name/items.json?search_name=${searchQuery}`,
        {
          cancelToken,
        }
      )
      .then((res) => {
        const boundaries = res?.data?.rows && parsePgFsRes(res.data.rows);

        return boundaries;
      })
      .catch(() => {
        return [];
      }),
  ]).then(
    spread((nominatim, boundaries) => {
      return [...nominatim, ...boundaries];
    })
  );
};

export const fetchReverseGeocodePoint = ({ lat, lng, cancelToken }) => {
  return nominatimGeocodingRequest({
    method: "get",
    url: `/reverse?lat=${lat}&lon=${lng}&format=geojson`,
    cancelToken: cancelToken,
  }).then((res) => {
    return res?.data?.features?.map((f) => {
      return {
        ...f,
        source: "nominatim",
        id: POLITICAL_BOUNDARIES,
        bbox: f.bbox,
        center: f.geometry.coordinates,
        place_name: f.properties.name
          ? f.properties.name
          : f.properties.display_name,
      };
    });
  });
};
