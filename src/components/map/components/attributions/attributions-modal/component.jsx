import PropTypes from "prop-types";

import Modal from "@/components/modal";
import Icon from "@/components/ui/icon";

import mapboxLogo from "@/assets/logos/mapbox.svg?sprite";
import geeLogo from "@/assets/logos/gee.png";
import cartoLogo from "@/assets/logos/carto.png";
import planetLogo from "@/assets/logos/planet.png";

import "./styles.scss";

const ModalAttributions = ({ open, onRequestClose }) => (
  <Modal
    open={open}
    contentLabel="Attributions"
    onRequestClose={onRequestClose}
    title="Map Attributions"
    className="c-modal-attributions"
  >
    <div className="modal-attributions-content">
      <div className="body">
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
        </div>
      </div>
    </div>
  </Modal>
);

ModalAttributions.propTypes = {
  open: PropTypes.bool,
  onRequestClose: PropTypes.func,
};

export default ModalAttributions;
