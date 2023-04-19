import React from "react";
import { parseISO, format, addDays } from "date-fns";

const LayerTimeSentence = ({ config, params }) => {
  if (config.param && params && params[config.param]) {
    let time = params[config.param];

    try {
      time = parseISO(time);
      const dateFormat = config.format || "do MMM y";
      let formatted = time && format(time, dateFormat);

      if (config.add && !isNaN(config.add)) {
        const end = addDays(time, config.add);
        formatted = `${formatted} to ${format(end, dateFormat)}`;
      }

      if (config.template) {
        formatted = config.template.replace("{time}", formatted);
      }

      return <div>{formatted}</div>;
    } catch (error) {
      return null;
    }
  }

  return null;
};

export default LayerTimeSentence;
