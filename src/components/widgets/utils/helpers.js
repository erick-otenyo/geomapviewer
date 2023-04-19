const isAreaComputed = status => status === 'saved';
const isCountryArea = type => type === 'country';

export const shouldQueryPrecomputedTables = params =>
  isAreaComputed(params.status) ||
  isCountryArea(params.type);