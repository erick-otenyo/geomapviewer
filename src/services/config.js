import { apiRequest } from "@/utils/request";

export const getConfig = () =>
  apiRequest.get("/mapviewer-config").then((res) => res?.data);
