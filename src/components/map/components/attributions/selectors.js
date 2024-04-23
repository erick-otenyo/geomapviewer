import { createStructuredSelector } from "reselect";

export const selectDisclaimerText = (state) =>
  state.config && state.config.disclaimerText;

export const links = (state) => state.config && state.config.links;

export const getAttributionProps = createStructuredSelector({
  disclaimerText: selectDisclaimerText,
  links: links,
});
