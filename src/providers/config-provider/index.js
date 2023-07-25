import { PureComponent, createRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import { wrap } from "comlink";

import reducerRegistry from "@/redux/registry";

import * as ownActions from "./actions";
import reducers, { initialState } from "./reducers";
import { getConfigProps } from "./selectors";
import { setMapBasemap } from "@/components/map/actions";

const actions = {
  ...ownActions,
  setMapBasemap,
};

class ConfigProvider extends PureComponent {
  svgWorkerRef = createRef();

  state = {
    ready: false,
  };

  componentDidMount() {
    const { fetchConfig } = this.props;

    fetchConfig().then((res) => {
      this.setState({ ready: true });
    });

    if (!this.svgWorkerRef.current) {
      this.svgWorkerRef.current = wrap(
        new Worker(new URL("./svg-worker.js", import.meta.url))
      );
    }

    this.parseSvgSprite();
  }

  componentDidUpdate(prevProps, prevState) {
    const { basemaps: prevBasemaps } = prevProps;
    const { basemaps, basemap, setMapBasemap } = this.props;

    if (!isEqual(basemaps, prevBasemaps)) {
      if (!basemap.value) {
        const defaultApiBasemap = Object.values(basemaps).find(
          (b) => b.default
        );

        if (defaultApiBasemap) {
          setMapBasemap({ value: defaultApiBasemap.value });
        }
      }
    }
  }

  parseSvgSprite = async () => {
    const { setConfig } = this.props;
    const dataSpriteEl = document.getElementById("svg-data-sprite");

    if (dataSpriteEl && this.svgWorkerRef.current) {
      const svgEl = dataSpriteEl.getElementsByTagName("svg");

      if (svgEl) {
        const defs = svgEl[0].getElementsByTagName("defs");

        if (defs) {
          const defsHTML = defs[0].outerHTML;

          const svgById = await this.svgWorkerRef.current.parseSvgSymbols(
            defsHTML
          );

          setConfig({ svgById });
        }
      }
    }
  };

  render() {
    const { ready } = this.state;
    const { children } = this.props;

    if (ready) {
      return children;
    }

    return null;
  }
}

ConfigProvider.propTypes = {
  fetchConfig: PropTypes.func.isRequired,
  setMapBasemap: PropTypes.func.isRequired,
  basemaps: PropTypes.object,
  basemap: PropTypes.object,
};

reducerRegistry.registerModule("config", {
  actions,
  reducers,
  initialState,
});

export default connect(getConfigProps, actions)(ConfigProvider);
