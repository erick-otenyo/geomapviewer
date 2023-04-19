import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { Button } from "@erick-otenyo/hw-components";

import Icon from "@/components/ui/icon";

import infoIcon from "@/assets/icons/info.svg?sprite";

import AttributionsModal from "./attributions-modal";

import "./styles.scss";

const MapAttributions = ({ className, viewport, map }) => {
  const width = map._container.clientWidth;
  const [open, setAttributionsModalOpen] = useState(false);
  const [narrowView, setNarrowView] = useState(width < 900);

  useEffect(() => {
    setNarrowView(width < 900);
  }, [viewport]);

  return (
    <div className={cx("c-map-attributions", className)}>
      <div className="logos"></div>
      {!narrowView && (
        <>
          <a
            href="http://openmaptiles.org/"
            rel="noopener noreferrer"
            target="_blank"
          >
            © OpenMapTiles
          </a>
          <a
            href="https://www.openstreetmap.org/copyright"
            rel="noopener noreferrer"
            target="_blank"
          >
            © OpenStreetMap Contributors
          </a>
        </>
      )}
      {narrowView && (
        <>
          <Button
            className="attribution-btn"
            size="small"
            round
            dark
            onClick={() => setAttributionsModalOpen(true)}
          >
            <Icon icon={infoIcon} />
          </Button>
          <AttributionsModal
            open={open}
            onRequestClose={() => setAttributionsModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

MapAttributions.propTypes = {
  className: PropTypes.string,
  map: PropTypes.object,
  viewport: PropTypes.object,
};

export default MapAttributions;
