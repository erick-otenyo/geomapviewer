import { createStructuredSelector } from "reselect";
import { getActiveLayers } from "@/components/map/selectors";

const selectLogo = (state) => state.config?.logo;

export const getProps = createStructuredSelector({
  activeLayers: getActiveLayers,
  logo: selectLogo,
});
