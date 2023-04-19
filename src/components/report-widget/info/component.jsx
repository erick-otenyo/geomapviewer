import { useMemo } from "react";
import cx from "classnames";

import "./styles.scss";

const WidgetInfo = ({ metadata, className }) => {
  const widgetLinks = useMemo(() => metadata?.[0]?.info?.widgetLinks || [], [
    metadata,
  ]);

  return (
    <div
      className={cx("c-widget-info", {
        [className]: className,
      })}
    >
      <div className="widget-info-row">
        {!widget?.description && <p>No additional information is available.</p>}

        {widget?.description && (
          <>
            <h4>Description</h4>
            <p>{widget.description}</p>
          </>
        )}
      </div>

      {widgetLinks.length > 0 && (
        <div className="widget-info-row">
          <div className="widget-links-container">
            <h4>Links</h4>
            <ul>
              {widgetLinks.map((link) => (
                <li key={link.link}>
                  <a href={link.link} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetInfo;
