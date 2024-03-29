import { getCookie } from "@/utils/cookies";
import { apiRequest } from "@/utils/request";

const LARGE_ISOS = [];

const GEOSTORE_URL_PATH = "/geostore/";

export const getGeostore = async ({ type, adm0, adm1, adm2, token }) => {
  if (!type || !adm0) return null;

  let thresh = adm1 ? 0.0005 : 0.005;
  let url = GEOSTORE_URL_PATH;

  switch (type) {
    case "country":
      thresh = LARGE_ISOS.includes(adm0) ? 0.05 : 0.005;
      url = url.concat(
        `admin/${adm0}${adm1 ? `/${adm1}` : ""}${adm2 ? `/${adm2}` : ""}`
      );
      break;
    case "geostore":
      url = url.concat(`${adm0}`);
      break;
    case "use":
      url = `/map-boundary-data/${adm0}/${adm1}`;
      break;
    default:
      return false;
  }

  return apiRequest
    .get(`${url}?thresh=${thresh}`, { cancelToken: token })
    .then((response) => {
      const { attributes: geostore } = response?.data || {};
      return {
        ...geostore,
        id: geostore?.hash,
      };
    });
};

export const saveGeostore = (geojson, onUploadProgress, onDownloadProgress) => {
  const csrftoken = getCookie("csrftoken");
  const headers = { "content-type": "application/json" };

  if (csrftoken) {
    headers["X-CSRFToken"] = csrftoken;
  }

  return apiRequest({
    method: "POST",
    headers: headers,
    data: {
      geojson,
    },
    url: GEOSTORE_URL_PATH,
    onUploadProgress,
    onDownloadProgress,
  }).then((res) => res.data);
};
