import request from "@/utils/request";

import { HW_CMS_API } from "@/utils/apis";

export const getApiDatasets = () =>
  request.get(`${HW_CMS_API}/datasets/`).then((res) => res?.data);

export const getLayerById = (layerId) =>
  request.get(`${HW_CMS_API}/layers/${layerId}`);
