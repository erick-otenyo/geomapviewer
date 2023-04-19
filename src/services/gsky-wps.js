import request from "@/utils/request";
import { GSKY_WPS_URL } from "@/utils/apis";

export const fetchGskyWps = ({
  identifier,
  feature,
  startDateTimeParam,
  endDateTimeParam,
  token,
  owsNameSpace,
}) => {
  const params = {
    identifier: identifier,
  };

  if (startDateTimeParam) {
    params.start_datetime = startDateTimeParam;
  }

  if (endDateTimeParam) {
    params.end_datetime = endDateTimeParam;
  }

  if (owsNameSpace) {
    params.ows_namespace = owsNameSpace;
  }

  return request
    .post(
      `${GSKY_WPS_URL}`,
      { ...feature },
      { params, cancelToken: token, timeout: 120 * 1000 }
    )
    .then((res) => {
      return { identifier: identifier, data: res.data.data };
    });
};
