import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { translateText } from "@/utils/lang";

import Dropdown from "@/components/ui/dropdown";

import Select from "./select";
import CheckboxGroup from "@/components/ui/checkbox-group";

import "./styles.scss";

class FilterSelector extends PureComponent {
  static defaultProps = {
    sentence: "Displaying {name} for {selector}",
  };

  reduceSentence = (sentence, pattern, component) => {
    const split = sentence.split(pattern);
    return [split[0], component, split[1]];
  };

  render() {
    const {
      onChange,
      className,
      options,
      value,
      sentence,
      name,
      isMulti,
      type,
    } = this.props;

    const translateSentence = translateText(sentence);

    const nameRepl =
      translateSentence.includes("{name}") && name
        ? this.reduceSentence(translateSentence, "{name}", name).join("")
        : sentence;

    const dropDownRepl = this.reduceSentence(
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
      />
    );

    const selectorRepl = this.reduceSentence(
      nameRepl,
      "{selector}",

      <Select
        // menuIsOpen
        isMulti={isMulti}
        value={value}
        key={name || `${value}-${sentence}`}
        options={options}
        onChange={onChange}
      />
    );

    const checkboxRepl = this.reduceSentence(
      nameRepl,
      "{selector}",

      <CheckboxGroup
        value={value}
        key={name || `${value}-${sentence}`}
        options={options}
        onChange={onChange}
      />
    );

    return (
      <div className={`c-filter-selector notranslate ${className || ""}`}>
        {checkboxRepl}
      </div>
    );
  }
}

FilterSelector.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  onChange: PropTypes.func,
  options: PropTypes.array,
  sentence: PropTypes.string,
  name: PropTypes.string,
};

export default FilterSelector;
