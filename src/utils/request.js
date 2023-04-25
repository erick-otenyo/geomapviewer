import axios from "axios";

import { CMS_API } from "@/utils/apis";

const isServer = typeof window === "undefined";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const TIMEOUT = 50 * 1000;

export const apiRequest = axios.create({
  timeout: TIMEOUT,
  baseURL: CMS_API,
});

export const apiAuthRequest = axios.create({
  timeout: TIMEOUT,
  baseURL: CMS_API,
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${!isServer && localStorage.getItem("userToken")}`,
  },
});

export const nominatimGeocodingRequest = axios.create({
  timeout: TIMEOUT,
  baseURL: "https://nominatim.openstreetmap.org",
});

export const cancelToken = () => axios.CancelToken.source();

export default axios.create({
  timeout: TIMEOUT,
});
