import { createAction } from "@/redux/actions";

export const setGeodescriberLoading = createAction("setGeodescriberLoading");
export const setGeodescriber = createAction("setGeodescriber");
export const clearGeodescriber = createAction("clearGeodescriber");

export const setGeodescriberSSR = (payload) => setGeodescriber(payload);
