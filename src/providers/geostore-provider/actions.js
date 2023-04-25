import { createAction, createThunkAction } from "@/redux/actions";
import { getGeostore, saveGeostore } from "@/services/geostore";

export const setGeostoreLoading = createAction("setGeostoreLoading");
export const setGeostore = createAction("setGeostore");
export const setMapLocationContextGeostore = createAction(
  "setMapLocationContextGeostore"
);
export const clearGeostore = createAction("clearGeostore");
export const clearMapLocationContextGeostore = createAction(
  "clearMapLocationContextGeostore"
);

export const fetchGeostore = createThunkAction(
  "fetchGeostore",
  (params) => (dispatch) => {
    const { type, adm0, adm1, adm2, token } = params;
    if (type && adm0) {
      dispatch(setGeostoreLoading({ loading: true, error: false }));
      getGeostore({ type, adm0, adm1, adm2, token })
        .then((geostore) => {
          if (geostore) {
            dispatch(setGeostore(geostore));
          } else {
            dispatch(setGeostoreLoading({ loading: false, error: true }));
          }
        })
        .catch(() => {
          dispatch(setGeostoreLoading({ loading: false, error: true }));
        });
    }
  }
);

export const getGeostoreId = createThunkAction(
  "getGeostoreId",
  ({ geojson, callback }) =>
    (dispatch) => {
      if (geojson) {
        dispatch(setGeostoreLoading({ loading: true, error: false }));

        saveGeostore(geojson)
          .then((geostore) => {
            if (geostore && geostore.data && geostore.data.data) {
              const { id } = geostore.data.data;
              if (callback) {
                callback(id);
              } else {
                dispatch(setGeostoreLoading({ loading: false, error: false }));
              }
            }
          })
          .catch(() => {
            setGeostoreLoading({
              loading: false,
              error: true,
            });
          });
      }
    }
);
