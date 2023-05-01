import { createAction, createThunkAction } from "@/redux/actions";

import { getConfig } from "@/services/config";
import { createCapDataset } from "../datasets-provider/datasets/cap";
import { updateDatasets } from "../datasets-provider/actions";

export const setConfigLoading = createAction("setConfigLoading");
export const setConfig = createAction("setConfig");
export const setSubCategorySettings = createAction("setSubCategorySettings");

export const fetchConfig = createThunkAction(
  "fetchConfig",
  () => (dispatch) => {
    dispatch(setConfigLoading({ loading: true, error: false }));

    getConfig()
      .then((config) => {
        const { categories, basemaps, capConfig } = config;

        const capDataset = createCapDataset(capConfig);

        dispatch(updateDatasets(capDataset));

        const sections = categories
          .filter((c) => c.active)
          .map((s) => ({
            label: "layers",
            slug: "datasets",
            category: s.title,
            id: s.id,
            icon: s.icon,
            subCategories: s.sub_categories
              .filter((s) => s.active)
              .map((subcat) => ({
                ...subcat,
                id: subcat.id,
                title: subcat.title,
                slug: subcat.id,
              })),
          }));

        const appConfig = {
          sections: sections,
          basemaps: basemaps.reduce((all, item) => {
            item.value = item.label;
            all[item.label] = item;
            return all;
          }, {}),
          capConfig,
        };

        dispatch(setConfig(appConfig));
      })
      .catch((err) => {
        console.log(err);
        dispatch(setConfigLoading({ loading: false, error: true }));
      });
  }
);
