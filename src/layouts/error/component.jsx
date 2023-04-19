import PropTypes from "prop-types";

import ErrorMessage from "@/components/error-message";

import "./styles.scss";

const ErrorPage = ({ title, description }) => (
  <>
    <div className="l-error-page">
      <ErrorMessage title={title} description={description} error />
    </div>
  </>
);

ErrorPage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

export default ErrorPage;
