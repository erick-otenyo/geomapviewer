import { FORM_ERROR } from "final-form";
import bbox from "@turf/bbox";

import { createThunkAction } from "@/redux/actions";
import { saveArea, deleteArea } from "@/services/aoi";
import {
  setArea,
  setAreas,
  viewArea,
  clearArea,
} from "@/providers/aoi-provider/actions";

export const saveAreaOfInterest = createThunkAction(
  "saveAreaOfInterest",
  (aoiData) => (dispatch, getState) => {
    const {
      id,
      name,
      tags,
      email,
      webhook_url,
      admin,
      viewAfterSave,
      geostore: geostoreId,
    } = aoiData;

    const { location, geostore } = getState();
    const { data: geostoreData } = geostore || {};
    const {
      payload: { type, adm0, adm1, adm2 },
    } = location || {};

    const isCountry = type === "country";

    const areaTags = tags ? tags.join(",") : "";

    const postData = {
      name,
      type,
      geostore_id: geostoreId || (geostoreData && geostoreData.id),
      email,
      ...(isCountry && {
        adm_0: adm0,
        adm_1: adm1,
        adm_2: adm2,
      }),
      ...(webhook_url && {
        webhook_url,
      }),
      tags: areaTags,
      public: true,
    };

    return saveArea(postData, id)
      .then((area) => {
        dispatch(setArea({ ...area, userArea: true }));
        if (viewAfterSave) {
          dispatch(viewArea({ areaId: area.id }));
        }
      })
      .catch((error) => {
        let { errors } = (error.response && error.response.data) || [];

        let err = errors && errors[0] && errors[0].detail;

        if (!err && error.message) {
          err = error.message;
        }

        return {
          [FORM_ERROR]: err,
        };
      });
  }
);

export const deleteAreaOfInterest = createThunkAction(
  "deleteAreaOfInterest",
  ({ id, clearAfterDelete, callBack }) =>
    (dispatch, getState) => {
      const { data: areas } = getState().areas || {};

      return deleteArea(id)
        .then(() => {
          dispatch(setAreas(areas.filter((a) => a.id !== id)));
          if (clearAfterDelete) {
            dispatch(clearArea());
          }
          if (callBack) {
            callBack();
          }
        })
        .catch((error) => {
          const { errors } = error?.response?.data || {};

          return {
            [FORM_ERROR]: errors[0].detail,
          };
        });
    }
);
