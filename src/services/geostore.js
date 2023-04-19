import { GEOSTORE_URL } from "@/utils/apis";
import { apiRequest } from "@/utils/request";

const LARGE_ISOS = [];

export const getGeostore = ({ type, adm0, adm1, adm2, token }) => {
  if (!type || !adm0) return null;

  let thresh = adm1 ? 0.0005 : 0.005;
  let url = GEOSTORE_URL;

  switch (type) {
    case "country":
      thresh = LARGE_ISOS.includes(adm0) ? 0.05 : 0.005;
      url = url.concat(
        `/admin/${adm0}${adm1 ? `/${adm1}` : ""}${adm2 ? `/${adm2}` : ""}`
      );
      break;
    case "use":
      url = url.concat(`/use/${adm0}/${adm1}`);
      break;
    case "geostore":
      url = url.concat(`/${adm0}`);
      break;
    default:
      return false;
  }

  url = url.replace(/([^:]\/)\/+/g, "$1");

  return apiRequest
    .get(`${url}?thresh=${thresh}`, { cancelToken: token })
    .then((response) => {
      const { attributes: geostore } = response?.data?.data || {};
      return {
        ...geostore,
        id: geostore?.hash,
      };
    });
};

export const saveGeostore = (geojson, onUploadProgress, onDownloadProgress) => {
  return apiRequest({
    method: "POST",
    headers: { "content-type": "application/json" },
    data: {
      geojson,
    },
    url: GEOSTORE_URL,
    onUploadProgress,
    onDownloadProgress,
  });
};
