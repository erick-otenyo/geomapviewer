import { createAction, createThunkAction } from "@/redux/actions";
import useRouter from "@/utils/router";

import { POLITICAL_BOUNDARIES_DATASET } from "@/data/datasets";
import { POLITICAL_BOUNDARIES } from "@/data/layers";

import { getAreas, getArea } from "@/services/aoi";

export const setAreasLoading = createAction("setAreasLoading");
export const setAreas = createAction("setAreas");
export const setArea = createAction("setArea");

export const fetchArea = createThunkAction(
  "getAreaProvider",
  (areaId) => (dispatch, getState) => {
    const { auth } = getState();
    const { data: userData } = auth || {};
    dispatch(setAreasLoading({ loading: true, error: false }));

    getArea(areaId)
      .then((area) => {
        dispatch(
          setArea({
            ...area,
            userArea: userData && userData.id === area.user,
          })
        );
        dispatch(setAreasLoading({ loading: false, error: false }));
      })
      .catch((error) => {
        dispatch(
          setAreasLoading({
            loading: false,
            error: error.response && error.response.status,
          })
        );
      });
  }
);

export const fetchAreas = createThunkAction(
  "getAreasProvider",
  () => (dispatch, getState) => {
    const { location } = getState();
    dispatch(setAreasLoading({ loading: true, error: false }));
    getAreas()
      .then((areas) => {
        const { type, adm0 } = location.payload || {};
        if (areas && !!areas.length) {
          dispatch(setAreas(areas));

          if (type === "aoi" && adm0 && !areas.find((d) => d.id === adm0)) {
            getArea(adm0)
              .then((area) => {
                dispatch(setArea(area));
                dispatch(setAreasLoading({ loading: false, error: false }));
              })
              .catch((error) => {
                dispatch(
                  setAreasLoading({
                    loading: false,
                    error: error.response && error.response.status,
                  })
                );
              });
          } else {
            dispatch(setAreasLoading({ loading: false, error: false }));
          }
        } else {
          dispatch(setAreasLoading({ loading: false, error: false }));
        }
      })
      .catch((error) => {
        dispatch(
          setAreasLoading({
            loading: false,
            error: error.response && error.response.status,
          })
        );
      });
  }
);

export const viewArea = createThunkAction(
  "viewArea",
  ({ areaId, pathname: forcePathname }) =>
    () => {
      const { pushQuery, query, pathname } = useRouter();
      const route = forcePathname || pathname;
      const basePath =
        route === "/mapviewer/[[...location]]" ? "mapviewer" : "dashboards";

      if (areaId && location) {
        const { mainMap, map } = query || {};

        pushQuery({
          pathname: `/${basePath}/aoi/${areaId}/`,
          query: {
            ...query,
            ...(basePath === "mapviewer" && {
              mainMap: {
                ...mainMap,
                showAnalysis: true,
              },
            }),
            map: {
              ...map,
              canBound: true,
              ...(map &&
                !map.datasets && {
                  datasets: [
                    // admin boundaries
                    {
                      dataset: POLITICAL_BOUNDARIES_DATASET,
                      layers: [POLITICAL_BOUNDARIES],
                      opacity: 1,
                      visibility: true,
                    },
                  ],
                }),
            },
          },
        });
      }
    }
);

export const clearArea = createThunkAction("clearArea", () => () => {
  const { asPath, pushQuery } = useRouter();
  const { query } = location;

  pushQuery({
    pathname: asPath?.split("?")?.[0],
    query,
  });
});
