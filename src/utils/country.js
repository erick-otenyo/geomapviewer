import AFRICA_COUNTRIES from "@/providers/country-data-provider/africa-countries";

export const getCountryMapViewSettings = (countryIso) => {
  const country = AFRICA_COUNTRIES.find((c) => c.iso === countryIso);

  return {
    bbox: country.bbox,
  };
};
