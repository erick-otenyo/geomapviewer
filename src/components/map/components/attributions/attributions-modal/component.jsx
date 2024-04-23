import PropTypes from "prop-types";

import Modal from "@/components/modal";
import Icon from "@/components/ui/icon";

import mapLibreLogo from "@/assets/logos/maplibre.svg?sprite";

import "./styles.scss";

const ModalAttributions = ({ open, onRequestClose, disclaimerText, links }) => (
  <Modal
    open={open}
    contentLabel="Attributions"
    onRequestClose={onRequestClose}
    title="Map Attributions"
    className="c-modal-attributions"
  >
    <div className="modal-attributions-content">
      <div className="body">
        <div className="logos">
          <a
            href="https://maplibre.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon className="maplibre-logo" icon={mapLibreLogo} />
          </a>
        </div>
        <div className="links">
          <a
            href="http://openmaptiles.org/"
            rel="noopener noreferrer"
            target="_blank"
          >
            © OpenMapTiles
          </a>
          <a
            href="http://www.openstreetmap.org/copyright"
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
        </div>

        {disclaimerText && (
          <div className="map-disclaimer">
            <p>{disclaimerText}</p>

            {links && links.disclaimerPageUrl && (
              <a
                href={links.disclaimerPageUrl}
                rel="noopener noreferrer"
                target="_blank"
                className="more-info"
              >
                More info
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  </Modal>
);

ModalAttributions.propTypes = {
  open: PropTypes.bool,
  onRequestClose: PropTypes.func,
};

export default ModalAttributions;
