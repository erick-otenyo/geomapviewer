import { apiRequest } from "@/utils/request";

export const getMetadata = (id) => apiRequest.get(`/metadata/${id}`);