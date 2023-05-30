import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Icon from "@/components/ui/icon";
import MapGeostore from "@/components/map-geostore";

import tagIcon from "@/assets/icons/tag.svg?sprite";

import "./styles.scss";

class AoICard extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    tags: PropTypes.array,
    application: PropTypes.string,
    createdAt: PropTypes.string,
    simple: PropTypes.bool,
    location: PropTypes.object,
    status: PropTypes.string,
    setConfirmSubscriptionModalSettings: PropTypes.func,
    confirmed: PropTypes.bool,
    id: PropTypes.string,
  };

  state = {
    alerts: {},
    loading: false,
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { tags, name, simple, location } = this.props;

    return (
      <div className={cx("c-aoi-card", { simple })}>
        <MapGeostore
          className="aoi-card-map"
          location={location}
          padding={simple ? 15 : 25}
          cursor="pointer"
          small={simple}
        />
        <div className="item-body">
          <h5 className="title">{name}</h5>
          {tags && tags.length > 0 && (
            <div className="tags">
              <Icon icon={tagIcon} className="tag-icon" />
              <p>{tags.join(", ")}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AoICard;
