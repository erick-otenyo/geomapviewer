import COUNTRIES from "@/providers/country-data-provider/countries";

export const getCountryMapViewSettings = (countryIso) => {
  const country = COUNTRIES.find((c) => c.iso === countryIso);

  return {
    bbox: country.bbox,
  };
};
