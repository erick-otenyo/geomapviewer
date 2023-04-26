import React from "react";
import { SortableHandle } from "react-sortable-hoc";
import Icon from "@/components/ui/icon";

import dragDots from "@/assets/icons/drag-dots.svg?sprite";

import "./styles.scss";

const LegendItemDrag = () => (
  <span className="c-legend-handler">
    <Icon icon={dragDots} />
  </span>
);

export default SortableHandle(LegendItemDrag);
