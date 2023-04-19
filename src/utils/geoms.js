import pointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";

export const checkLocationInsideBbox = (latLng, bbox) => {
  const pt = point(latLng);
  const poly = polygon([bbox]);

  return pointInPolygon(pt, poly);
};

export const reverseLatLng = (bounds) => bounds.map((b) => [b[1], b[0]]);

export const validateLatLng = (lat, lng) =>
  lat <= 90 && lat >= -90 && lng <= 180 && lng >= -180;

export const validateLat = (lat) => lat <= 90 && lat >= -90;

export const validateLng = (lng) => lng <= 180 && lng >= -180;
