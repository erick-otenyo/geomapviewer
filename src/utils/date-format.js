import { defined } from "@/utils/core";

import { parseISO, endOfMonth, format as dateFormat } from "date-fns";

/**
 * Formats a date according to the locale if provided, otherwise in a dd/mm/yyyy format.
 *
 * @param {Date} d the date to format
 * @param {Locale} [locale] the locale to use for formatting
 * @returns {string} A formatted date.
 */
export function formatDate(d, locale) {
  if (defined(locale)) {
    return d.toLocaleDateString(locale);
  }
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
}

/**
 * Formats the time according to the locale if provided, otherwise in a hh:mm:ss format.
 *
 * @param {Date} d the date to format
 * @param {Locale} [locale] the locale to use for formatting
 * @returns {string} A formatted time.
 */
export function formatTime(d, locale) {
  if (defined(locale)) {
    return d.toLocaleTimeString(locale);
  }
  return [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(
    ":"
  );
}

/**
 * Combines {@link #formatDate} and {@link #formatTime}.
 *
 * @param {Date} d the date to format
 * @param {Locale} [locale] the locale to use for formatting
 * @returns {string} A formatted date and time with a comma separating them.
 */
export function formatDateTime(d, locale) {
  return formatDate(d, locale) + ", " + formatTime(d, locale);
}

/**
 * Puts a leading 0 in front of a number of it's less than 10.
 *
 * @param {number} s A number to pad
 * @returns {string} A string representing a two-digit number.
 */
function pad(s) {
  return s < 10 ? "0" + s : `${s}`;
}

const getOrdinalNum = (number) => {
  let selector;

  if (number <= 0) {
    selector = 4;
  } else if ((number > 3 && number < 21) || number % 10 > 3) {
    selector = 0;
  } else {
    selector = number % 10;
  }

  return number + ["th", "st", "nd", "rd", ""][selector];
};

export function getPentadFromDateString(dateString) {
  const date = new Date(dateString);

  const lastDayOfMonth = endOfMonth(date).getDate();

  const day = date.getDate();

  if (day <= 5) {
    return [1, "1-5th", 1];
  }

  if (day <= 10) {
    return [2, "6-10th", 6];
  }

  if (day <= 15) {
    return [3, "11-15th", 11];
  }

  if (day <= 20) {
    return [4, "16-20th", 16];
  }

  if (day <= 25) {
    return [4, "21-25th", 21];
  }
  return [6, `26-${getOrdinalNum(lastDayOfMonth)}`, 26];
}

// if day <= 5:
// next_pentad_start = datetime(date.year, date.month, 6)
// next_pentad_num = 2
// elif day <= 10:
// next_pentad_start = datetime(date.year, date.month, 11)
// next_pentad_num = 3
// elif day <= 15:
// next_pentad_start = datetime(date.year, date.month, 16)
// next_pentad_num = 4
// elif day <= 20:
// next_pentad_start = datetime(date.year, date.month, 21)
// next_pentad_num = 5
// elif day <= 25:
// next_pentad_start = datetime(date.year, date.month, 26)
// next_pentad_num = 6
// else:
// next_pentad_start = date + relativedelta.relativedelta(months=1, day=1)
// next_pentad_num = 1

export function dFormatter(date, format, asPeriod) {
  let formated = dateFormat(parseISO(date), format);

  if (asPeriod) {
    if (asPeriod === "pentadal") {
      const [pentad, duration] = getPentadFromDateString(date);

      formated = `${formated} - P${pentad} ${duration}`;
    }
  }

  return formated;
}
