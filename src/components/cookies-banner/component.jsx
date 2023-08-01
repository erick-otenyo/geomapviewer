import React from "react";
import PropTypes from "prop-types";

import { Row, Column, Button, P } from "@erick-otenyo/hw-components";

import "./styles.scss";

const CookiesBanner = ({ onAccept, privacyPolicyPageUrl }) => (
  <div className="c-cookies-wrapper ">
    <Row>
      <Column width={[0, 1 / 12]} />
      <Column width={[1, 2 / 3]}>
        <P className="cookies-text">
          This website uses cookies to provide you with an improved user
          experience. By continuing to browse this site, you consent to the use
          of cookies and similar technologies.
          {privacyPolicyPageUrl && (
            <span>
              {" "}
              Please visit our
              <a
                href={privacyPolicyPageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                privacy policy
              </a>{" "}
              for further details.
            </span>
          )}
        </P>
      </Column>
      <Column width={[1, 1 / 6]} className="cookies-button">
        <Button
          className="cookies-btn"
          color="grey"
          size="small"
          onClick={onAccept}
        >
          I agree
        </Button>
      </Column>
    </Row>
  </div>
);

CookiesBanner.propTypes = {
  onAccept: PropTypes.func,
  privacyPolicyPageUrl: PropTypes.string,
};

export default CookiesBanner;
