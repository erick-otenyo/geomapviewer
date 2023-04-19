import { deburrUpper } from '@/utils/strings';
import moment from 'moment';

export const reduceParams = (params) => {
  if (!params) return null;
  return params.reduce((obj, param) => {
    const { format, key, interval, count } = param;
    let paramValue = param.default;
    const isDate = deburrUpper(param.key).includes('DATE');
    if (isDate && !paramValue) {
      let date = moment().utc();
      if (interval && count) date = date.subtract(count, interval);
      paramValue = date.format(format || 'YYYY-MM-DD');
    }

    const newObj = {
      ...obj,
      [key]: paramValue,
      ...(key === 'endDate' &&
        param.url && {
          latestUrl: param.url,
        }),
      ...(key === 'date' &&
        param.format && {
          latestFormat: param.format,
        }),
    };
    return newObj;
  }, {});
};

export const reduceSqlParams = (params) => {
  if (!params) return null;
  return params.reduce((obj, param) => {
    const newObj = {
      ...obj,
      [param.key]: param.key_params.reduce((subObj, item) => {
        const keyValues = {
          ...subObj,
          [item.key]: item.value || item.default,
        };
        return keyValues;
      }, {}),
    };
    return newObj;
  }, {});
};
