export const checkUserProfileFilled = ({
  email,
  fullName,
  lastName,
  sector,
} = {}) =>
  !!email &&
  (!!fullName || !!lastName) &&
  !!sector &&
  sector &&
  (sector.includes("Other")
    ? // if 'Other: <input>', we make sure that the value is not empty
      !!sector.split("Other:")[1].trim()
    : // otherwise we just check the subsector
      !!sector);
