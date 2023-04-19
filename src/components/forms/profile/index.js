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

const mapStateToProps = ({ auth, countryData }) => {
  const { howDoYouUse, sector, firstName, fullName, lastName } =
    auth.data || {};

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
    countries: countryData && countryData.countries,
    ...(auth &&
      auth.data && {
        initialValues: {
          ...auth.data,
          firstName: firstName || (fullName && splitFirstName(fullName)),
          lastName: lastName || (fullName && splitLastName(fullName)),
          sector: sectorOther ? "Other:" : sector,
          sector_otherInput: sectorOther,
          howDoYouUse: howDoYouUseOther
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
