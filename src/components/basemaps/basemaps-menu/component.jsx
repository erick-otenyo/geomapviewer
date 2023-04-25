import PropTypes from "prop-types";
import { Row, Column, Desktop } from "@erick-otenyo/hw-components";

import BasemapButton from "../basemap-button";

import "./styles.scss";

export const BasemapsMenu = ({ basemaps, activeBasemap, onSelectBasemap }) => {
  return (
    <div className="c-basemaps-menu">
      <Row>
        <Column>
          <Desktop>
            <h4>Map styles</h4>
          </Desktop>
        </Column>
        {Object.values(basemaps).map((item) => (
          <Column key={item.value} width={[1 / 3]} className="btn-col">
            <BasemapButton
              {...item}
              active={activeBasemap?.value === item?.value}
              onSelectBasemap={onSelectBasemap}
            />
          </Column>
        ))}
      </Row>
    </div>
  );
};

BasemapsMenu.propTypes = {
  basemaps: PropTypes.object,
  activeBasemap: PropTypes.object,
  onSelectBasemap: PropTypes.func,
};

export default BasemapsMenu;
