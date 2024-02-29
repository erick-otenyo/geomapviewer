import { createAction, createThunkAction } from "@/redux/actions";
import { getAdmLocationByLevel } from "@/utils/boundary";
import compact from "lodash/compact";

import useRouter from "@/utils/router";

export const setMainMapSettings = createAction("setMainMapSettings");

export const setMainMapAnalysisView = createThunkAction(
  "setMainMapAnalysisView",
  ({ data, layer, isPoint, latlng }) =>
    (dispatch, getState) => {
      const { boundaryDataSource } = getState().config || {};

      const { gid } = data || {};
      const { analysisEndpoint, tableName } = layer || {};
      const { query, pushQuery } = useRouter();
      const { map, mainMap } = query || {};

      // get location payload based on layer type
      let payload = {};

      if (isPoint && latlng) {
        payload = {
          type: "point",
          adm0: latlng.lat,
          adm1: latlng.lng,
          adm2: "latlng",
        };
      } else {
        if (data) {
          if (analysisEndpoint === "admin") {
            payload = {
              type: "country",
              ...getAdmLocationByLevel(data, boundaryDataSource),
            };
          } else if (gid && tableName) {
            payload = {
              type: "use",
              adm0: tableName,
              adm1: gid,
            };
          }
        }
      }

      if (payload && payload.adm0) {
        pushQuery({
          pathname: `/mapviewer/${compact(Object.values(payload))?.join("/")}/`,
          query: {
            ...query,
            map: {
              ...map,
              canBound: true,
            },
            mainMap: {
              ...mainMap,
              showAnalysis: true,
            },
          },
        });
      }
    }
);

export const setDrawnGeostore = createThunkAction(
  "setDrawnGeostore",
  (geostoreId) => () => {
    const { pushQuery, query } = useRouter();

    const { map, mainMap } = query || {};
    pushQuery({
      pathname: `/mapviewer/geostore/${geostoreId}/`,
      query: {
        ...query,
        map: {
          ...map,
          canBound: true,
          drawing: false,
        },
        mainMap: {
          ...mainMap,
          showAnalysis: true,
        },
      },
    });
  }
);
