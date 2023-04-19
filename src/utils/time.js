export const toMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString("en-US", {
    month: "long",
  });
};

export const getNextDate = (dates) => {
  // Get the current date time
  const now = new Date();

  // Find the date that is one step ahead of the current date time
  const nextDate = dates.find((dateStr) => {
    const date = new Date(dateStr);
    return date > now;
  });

  // Return the next date, or null if there isn't one
  return nextDate || null;
};
