import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { useRouter } from "next/router";

import {
  Loader,
  MediaContextProvider,
  Button,
} from "@erick-otenyo/hw-components";

import { useTrackPage } from "@/utils/analytics";
import { useSetLanguage } from "@/utils/lang";

import Head from "@/wrappers/head";

import ErrorMessage from "@/components/error-message";

import "./styles.scss";

const EmbedWrapper = ({
  children,
  title,
  description,
  noIndex,
  metaTags,
  exploreLink,
  error,
  errorTitle,
  errorDescription,
}) => {
  useTrackPage();
  useSetLanguage();

  // if a page is statically built with
  // fallback true we show a loader
  const { isFallback } = useRouter();

  return (
    <MediaContextProvider>
      <Head
        title={title}
        description={description}
        noIndex={noIndex}
        metaTags={metaTags}
      />
      <div className={cx("l-embed-page")}>
        <div className={cx("embed-content", { "-error": error })}>
          {isFallback && <Loader />}
          {!isFallback && error && (
            <ErrorMessage
              title={errorTitle || "Page Not Found"}
              description={
                errorDescription ||
                "You may have mistyped the address or the page may have moved."
              }
            />
          )}
          {!isFallback && !error && children}
        </div>

        <div className="embed-footer">
          <p>For more info</p>
          <a href={exploreLink} target="_blank" rel="noopener noreferrer">
            <Button className="embed-btn">EXPLORE ON MAPVIEWER</Button>
          </a>
        </div>
      </div>
    </MediaContextProvider>
  );
};

EmbedWrapper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  noIndex: PropTypes.bool,
  metaTags: PropTypes.string,
  exploreLink: PropTypes.string,
  error: PropTypes.number,
  errorTitle: PropTypes.string,
  errorDescription: PropTypes.string,
};

export default EmbedWrapper;
