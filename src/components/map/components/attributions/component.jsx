import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { Button } from "@erick-otenyo/hw-components";

import Icon from "@/components/ui/icon";

import mapLibreLogo from "@/assets/logos/maplibre.svg?sprite";
import infoIcon from "@/assets/icons/info.svg?sprite";

import AttributionsModal from "./attributions-modal";

import "./styles.scss";

const MapAttributions = ({
  className,
  viewport,
  map,
  disclaimerText,
  links,
}) => {
  const width = map._container.clientWidth;
  const [open, setAttributionsModalOpen] = useState(false);
  const [narrowView, setNarrowView] = useState(width < 900);

  useEffect(() => {
    setNarrowView(width < 900);
  }, [viewport]);

  return (
    <div className={cx("c-map-attributions", className)}>
      {!narrowView && (
        <>
          {disclaimerText && (
            <a
              rel="noopener noreferrer"
              target="_blank"
              style={{ maxWidth: 450 }}
              {...(links &&
                links.disclaimerPageUrl && { href: links.disclaimerPageUrl })}
            >
              {disclaimerText}
            </a>
          )}
          <div className="logos">
            <a
              href="https://maplibre.org"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon className="maplibre-logo" icon={mapLibreLogo} />
            </a>
          </div>
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

          {links && links.termsOfServicePageUrl && (
            <a
              href={links.termsOfServicePageUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Terms of service
            </a>
          )}
          {links && links.privacyPolicyPageUrl && (
            <a
              href={links.privacyPolicyPageUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy policy
            </a>
          )}
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
            disclaimerText={disclaimerText}
            links={links}
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
