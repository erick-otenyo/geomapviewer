import { apiAuthRequest } from "@/utils/request";

import { trackEvent } from "@/utils/analytics";
import { getCookie } from "@/utils/cookies";

export const getArea = (id, userToken = null) =>
  apiAuthRequest
    .get(`/aoi/${id}`, {
      headers: {
        ...(userToken && {
          Authorization: `Bearer ${userToken}`,
        }),
      },
    })
    .then((areaResponse) => {
      const { data: area } = areaResponse;

      return area;
    });

export const getAreas = () =>
  apiAuthRequest.get(`/aoi`).then((areasResponse) => {
    const { data: areas } = areasResponse;

    return areas.map((area) => {
      return {
        ...area,
        userArea: true,
      };
    });
  });

export const saveArea = (data, areaId) => {
  const csrfToken = getCookie("csrftoken");
  const url = areaId ? `/aoi/${areaId}` : `/aoi`;

  const headers = {};
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  return apiAuthRequest({
    method: areaId ? "PATCH" : "POST",
    url: url,
    data: data,
    headers: headers,
  }).then((areaResponse) => {
    const { data } = areaResponse;

    trackEvent({
      category: "User AOIs",
      action: areaId ? "User edits aoi" : "User saves aoi",
      label: data.id,
    });

    return {
      ...data,
      userArea: true,
    };
  });
};

export const deleteArea = (id) => {
  const csrfToken = getCookie("csrftoken");

  const headers = {};
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  trackEvent({
    category: "User AOIs",
    action: "User deletes aoi",
    label: id,
  });

  return apiAuthRequest.delete(`/aoi/${id}`, { headers });
};
