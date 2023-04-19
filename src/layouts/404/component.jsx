import ErrorMessage from "@/components/error-message";

import "./styles.scss";

const NotFoundPage = () => (
  <>
    <div className="l-404-page">
      <ErrorMessage
        title="Page Not Found"
        description="You may have mistyped the address or the page may have moved."
        error
      />
    </div>
  </>
);

export default NotFoundPage;