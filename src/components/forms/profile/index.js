import { connect } from "react-redux";

import Component from "./component";
import * as actions from "./actions";

const splitFirstName = (fullName) => {
  const arr = fullName && fullName.split(" ");
  return arr && arr.length > 1
    ? arr.slice(0, arr.length / 2).join(" ")
    : fullName;
};

const splitLastName = (fullName) => {
  const arr = fullName && fullName.split(" ");
  return arr && arr.length > 1
    ? arr.slice(arr.length / 2, arr.length).join(" ")
    : fullName;
};

const mapStateToProps = ({ auth, config }) => {
  const {
    links: { contactUsPageUrl },
  } = config;

  const { how_do_you_use: howDoYouUse, sector } = auth.data || {};

  const sectorHasOther = sector && sector.includes("Other");
  const sectorSplit = sectorHasOther && sector.split("Other:");
  const sectorOther =
    sectorSplit && sectorSplit.length >= 2 ? sectorSplit[1].trim() : null;

  const howDoYouUseOtherEntry =
    howDoYouUse && howDoYouUse.find((el) => el.includes("Other"));
  const howDoYouUseSplit =
    howDoYouUseOtherEntry && howDoYouUseOtherEntry.split("Other:");
  const howDoYouUseOther =
    howDoYouUseSplit && howDoYouUseSplit.length >= 2
      ? howDoYouUseSplit[1].trim()
      : null;

  return {
    contactUsPageUrl,
    ...(auth &&
      auth.data && {
        initialValues: {
          ...auth.data,
          sector: sectorOther ? "Other:" : sector,
          sector_otherInput: sectorOther,
          how_do_you_use: howDoYouUseOther
            ? [
                ...(howDoYouUse &&
                  howDoYouUse.filter((use) => !use.includes("Other"))),
                "Other",
              ]
            : howDoYouUse,
          howDoYouUse_otherInput: howDoYouUseOther,
        },
      }),
  };
};

export default connect(mapStateToProps, actions)(Component);
