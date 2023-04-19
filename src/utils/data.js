import reduce from "lodash/reduce";
import isEqual from "lodash/isEqual";
import { parseISO, getDaysInMonth } from "date-fns";
import { getPentadFromDateString } from "./date-format";

export const objDiff = (obj1, obj2) => {
  return reduce(
    obj1,
    (result, value, key) => {
      if (!isEqual(value, obj2[key])) {
        result[key] = value;
      }
      return result;
    },
    {}
  );
};

export const gskyWpsDataByYear = (data, options = {}) => {
  const { add, multiply, divide, subtract } = options;

  const byYear = data.reduce((all, item) => {
    const date = parseISO(item.date);
    const year = date.getFullYear();
    let value = item.value;

    if (add) {
      value = value + add;
    } else if (subtract) {
      value = value - subtract;
    } else if (multiply) {
      value = value * multiply;
    } else if (divide) {
      value = value / divide;
    }

    const dValue = { value: value };
    if (all[year]) {
      all[year].push(dValue);
    } else {
      all[year] = [dValue];
    }
    return all;
  }, {});

  const dataByYear = Object.keys(byYear).reduce((all, year) => {
    let value = byYear[year].reduce((avg, item, _, { length }) => {
      return avg + item.value / length;
    }, 0);

    all.push({ date: year, value });

    return all;
  }, []);

  return dataByYear;
};

export const gskyWpsDataByMonthNo = (data, month, yearAsTime = true) => {
  const byYear = data.reduce((all, item) => {
    const date = parseISO(item.date);
    const year = date.getFullYear();
    const dMonth = date.getMonth() + 1;

    if (month === dMonth) {
      let value = item.value;

      const dValue = { value: value };

      if (all[year]) {
        all[year].push(dValue);
      } else {
        all[year] = [dValue];
      }
    }

    return all;
  }, {});

  const dataByYear = Object.keys(byYear).reduce((all, year) => {
    let value = byYear[year].reduce((avg, item, _, { length }) => {
      return avg + item.value / length;
    }, 0);

    if (yearAsTime) {
      all.push({ date: new Date(year, month - 1).toISOString(), year, value });
    } else {
      all.push({ date: year, value });
    }

    return all;
  }, []);

  return dataByYear;
};

export const gskyWpsDataByPentadNo = (data, pentad, yearAsTime = true) => {
  let pentadStartDate;
  const byYearMonth = data.reduce((all, item) => {
    const [dPentad, _, pStart] = getPentadFromDateString(item.date);

    pentadStartDate = pStart;

    if (dPentad === pentad) {
      const date = parseISO(item.date);
      const year = date.getFullYear();
      const dMonth = date.getMonth() + 1;

      if (all[year]) {
        if (all[year][dMonth]) {
          all[year][dMonth].push(item);
        } else {
          all[year][dMonth] = [item];
        }
      } else {
        all[year] = { [dMonth]: [item] };
      }
    }
    return all;
  }, {});

  const dataByYearMonth = Object.keys(byYearMonth).reduce((all, year) => {
    const yearMonthAv = Object.keys(byYearMonth[year]).reduce((m, month) => {
      const monthAvg = byYearMonth[year][month].reduce(
        (avg, item, _, { length }) => {
          return avg + item.value / length;
        },
        0
      );

      const date = new Date(year, month, pentadStartDate).toISOString();

      m.push({ date: date, year: year, value: monthAvg });
      return m;
    }, []);

    all.push(...yearMonthAv);

    return all;
  }, []);

  return dataByYearMonth;
};

export const gskyWpsPrecipitationDataByYear = (data) => {
  const byYear = data.reduce((all, item) => {
    const date = parseISO(item.date);
    const year = date.getFullYear();

    // get days in this month
    const daysInMonth = getDaysInMonth(date);

    // To get the total precipitation for a day (mm), from m
    // https://confluence.ecmwf.int/pages/viewpage.action?pageId=197702790
    // tp [mm]=tp [m/day]⋅1000⋅N
    const value = item.value * 1000 * daysInMonth;

    const dValue = { value: value };
    if (all[year]) {
      all[year].push(dValue);
    } else {
      all[year] = [dValue];
    }
    return all;
  }, {});

  const dataByYear = Object.keys(byYear).reduce((all, year) => {
    let mean = byYear[year].reduce((sum, item) => {
      return sum + item.value;
    }, 0);

    all.push({ year, mean });

    return all;
  }, []);

  return dataByYear;
};

// gskyWpsPrecipitationDataByTimestamp
// gskyWpsDataByTimestamp

export const gskyWpsDataByTimestamp = (data, options = {}) => {
  const { add, multiply, divide, subtract } = options;

  const dataByTimestamps = data.map((d) => {
    const timestamp = parseISO(d.date).getTime();

    let value = d.value;

    if (add) {
      value = value + add;
    } else if (subtract) {
      value = value - subtract;
    } else if (multiply) {
      value = value * multiply;
    } else if (divide) {
      value = value / divide;
    }

    return { x: timestamp, y: value };
  });

  return dataByTimestamps;
};

export const gskyWpsPrecipitationDataByTimestamp = (data) => {
  const dataByTimestamps = data.map((item) => {
    const date = parseISO(item.date);

    // get days in this month
    const daysInMonth = getDaysInMonth(date);

    // To get the total precipitation for a day (mm), from m
    // https://confluence.ecmwf.int/pages/viewpage.action?pageId=197702790
    // tp [mm]=tp [m/day]⋅1000⋅N
    const value = item.value * 1000 * daysInMonth;

    const timestamp = date.getTime();

    return { x: timestamp, y: value };
  });

  return dataByTimestamps;
};

export const gskyWpsTemperatureAnomaliesByMonth = (data, month) => {
  const dataByMonth = data.reduce((all, item) => {
    const date = parseISO(item.date);
    const dmonth = String(date.getMonth() + 1).padStart(2, "0");

    if (dmonth === month) {
      all.push({ x: date.getTime(), y: item.value });
    }

    return all;
  }, []);

  return dataByMonth;
};

export const gskyWpsPrecipitationAnomaliesByMonth = (data, month) => {
  const dataByMonth = data.reduce((all, item) => {
    const date = parseISO(item.date);
    const dmonth = String(date.getMonth() + 1).padStart(2, "0");

    if (dmonth === month) {
      // get days in this month
      const daysInMonth = getDaysInMonth(date);

      // To get the total precipitation for a day (mm), from m
      // https://confluence.ecmwf.int/pages/viewpage.action?pageId=197702790
      // tp [mm]=tp [m/day]⋅1000⋅N
      const value = item.value * 1000 * daysInMonth;

      all.push({ x: date.getTime(), y: value });
    }
    return all;
  }, []);

  return dataByMonth;
};
