import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Button from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import Dotdotdot from "react-dotdotdot";
import cx from "classnames";
import Icon from "@/components/ui/icon";

import arrowIcon from "@/assets/icons/arrow-down.svg?sprite";
import "./styles.scss";
import "./themes/card-small.scss";
import "./themes/card-dark.scss";

class Card extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    className: PropTypes.string,
    theme: PropTypes.string,
    onClick: PropTypes.func,
    active: PropTypes.bool,
    tag: PropTypes.string,
    tagColor: PropTypes.string,
    clamp: PropTypes.number,
  };

  state = {
    selectorValue: {},
  };

  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { className, theme, data, active, clamp } = this.props;
    const {
      image,
      webPImage,
      img1x,
      img2x,
      imageCredit,
      title,
      summary,
      fullSummary,
      meta,
      buttons,
      tag,
      tagColor,
      selector,
      tagFontColor,
    } = data || {};
    const { selectorValue } = this.state;

    return (
      <div className={cx("c-card", className, theme, { active })}>
        {tag && tagColor && (
          <span className="tag" style={{ backgroundColor: tagColor }}>
            <p style={{ color: tagFontColor && tagFontColor }}>{tag}</p>
          </span>
        )}
        <>
          {image && (
            <picture className="image">
              {webPImage && <source srcSet={webPImage} type="image/webp" />}
              <source srcSet={image} type="image/png" />
              <img src={image} alt={title} />
            </picture>
          )}

          {(img1x || img2x) && (
            <img
              className="image"
              srcSet={`${img1x} 2x, ${img2x} 1x`}
              src={`${img1x} 1x`}
              alt={title}
            />
          )}
        </>
        <div
          className={cx(
            "body",
            { "no-image": !image },
            { "top-padding": tag && tagColor && !image }
          )}
        >
          <div className="text-content">
            {imageCredit && <span>{imageCredit}</span>}
            {title && <h3 className="title">{title}</h3>}
            {summary && (
              <div className="summary">
                {fullSummary ? (
                  summary
                ) : (
                  <Dotdotdot clamp={clamp || 3}>{summary}</Dotdotdot>
                )}
              </div>
            )}
            {meta && <p className="meta">{meta}</p>}
          </div>
          {buttons && (
            <div className="buttons">
              {buttons.map((button, i) => {
                if (button.link) {
                  return (
                    <Button
                      key={button.link}
                      theme="theme-button-light"
                      {...button}
                    >
                      {button.text}
                    </Button>
                  );
                }

                if (button.extLink) {
                  return (
                    <Button
                      theme="theme-button-light"
                      key={button.extLink}
                      {...button}
                    >
                      {button.text}
                    </Button>
                  );
                }

                return (
                  <Button
                    key={`${button.text}-${i}`}
                    theme="theme-button-light"
                    {...button}
                  >
                    {button.text}
                  </Button>
                );
              })}
            </div>
          )}
          {selector && (
            <div className="selector-btn">
              <Dropdown
                className="card-selector"
                theme="theme-dropdown-native large"
                options={selector && selector.options}
                value={
                  selectorValue.value ||
                  (selector.options && selector.options[0])
                }
                onChange={(value) =>
                  this.setState({
                    selectorValue:
                      selector.options &&
                      selector.options.find((o) => o.value === value),
                  })
                }
                native
              />
              <a
                href={
                  selectorValue.path ||
                  (selector.options &&
                    selector.options[0] &&
                    selector.options[0].path)
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="selector-btn-link" theme="square">
                  <Icon icon={arrowIcon} />
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Card;
