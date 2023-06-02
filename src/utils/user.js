export const checkUserProfileFilled = ({
  email,
  full_name,
  last_name,
  sector,
} = {}) => {
  const isComplete =
    !!email &&
    (!!full_name || !!last_name) &&
    !!sector &&
    sector &&
    (sector.includes("Other")
      ? // if 'Other: <input>', we make sure that the value is not empty
        !!sector.split("Other:")[1].trim()
      : // otherwise we just check the subsector
        !!sector);

  return isComplete;
};
