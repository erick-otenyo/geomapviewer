import findIndex from "lodash/findIndex";
import * as actions from "./actions";

export const initialState = {
  loading: true,
  error: false,
  data: [],
};

const setSectionsLoading = (state, { payload }) => ({
  ...state,
  ...payload,
});

const setSections = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false,
});

const setSubCategorySettings = (state, { payload }) => {
  const { data: sections } = state;

  const sectionIndex = findIndex(sections, ["id", payload.sectionId]);

  const data = [...sections];

  if (sectionIndex > -1) {
    const subCategories = [...data[sectionIndex].subCategories];

    if (subCategories) {
      const subCatIndex = findIndex(subCategories, [
        "id",
        payload.subCategoryId,
      ]);

      if (subCatIndex > -1) {
        const subCategory = subCategories[subCatIndex];

        subCategories.splice(subCatIndex, 1, {
          ...subCategory,
          ...payload.settings,
        });

        data.splice(sectionIndex, 1, {
          ...data[sectionIndex],
          subCategories: subCategories,
        });
      }
    }
  }

  return {
    ...state,
    data,
  };
};

export default {
  [actions.setSectionsLoading]: setSectionsLoading,
  [actions.setSections]: setSections,
  [actions.setSubCategorySettings]: setSubCategorySettings,
};
