import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { translateText } from "@/utils/lang";

import Dropdown from "@/components/ui/dropdown";
import RadioGroup from "@/components/ui/radio-group";

import "./styles.scss";

class SentenceSelector extends PureComponent {
  static defaultProps = {
    sentence: "Displaying {name} for {selector}",
  };

  reduceSentence = (sentence, pattern, component, selectorDescription) => {
    const split = sentence.split(pattern);

    return [
      <div className="selector-header" key={split[0]}>
        <span className="selector-title">{split[0]}</span>
        {selectorDescription && (
          <span className="selector-desc">{selectorDescription}</span>
        )}
      </div>,
      component,
      split[1],
    ];
  };

  render() {
    const {
      onChange,
      className,
      options,
      value,
      sentence,
      name,
      type,
      selectorDescription,
      columnView,
    } = this.props;

    const translateSentence = translateText(sentence);
    const nameRepl =
      translateSentence.includes("{name}") && name
        ? this.reduceSentence(translateSentence, "{name}", name).join("")
        : sentence;

    let selectorRepl;

    if (type && type === "radio") {
      selectorRepl = this.reduceSentence(
        nameRepl,
        "{selector}",
        <RadioGroup
          key={name || `${value}-${sentence}`}
          options={options}
          value={value}
          onChange={onChange}
        />,
        selectorDescription
      );
    } else {
      selectorRepl = this.reduceSentence(
        nameRepl,
        "{selector}",
        <Dropdown
          key={name || `${value}-${sentence}`}
          className="sentence-dropdown"
          theme="theme-dropdown-native-button"
          value={value}
          options={options}
          onChange={onChange}
          native
        />,
        selectorDescription
      );
    }

    return (
      <div
        className={`c-sentence-selector notranslate ${className || ""} ${
          !columnView && "margin"
        }`}
      >
        {selectorRepl}
      </div>
    );
  }
}

SentenceSelector.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object,
  ]),
  onChange: PropTypes.func,
  options: PropTypes.array,
  sentence: PropTypes.string,
  selectorDescription: PropTypes.string,
  name: PropTypes.string,
};

export default SentenceSelector;
