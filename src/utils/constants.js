export const PRODUCTION =
  process.env.FEATURE_ENV &&
  process.env.FEATURE_ENV === "production";
