import { cmsApiRequest } from "@/utils/request";

export const getMetadata = (id) => cmsApiRequest.get(`/metadata/${id}/`);

export default {
  getMetadata,
};
