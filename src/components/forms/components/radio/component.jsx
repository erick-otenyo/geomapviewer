/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Field } from "react-final-form";
import uniqueId from "lodash/uniqueId";
import isEmpty from "lodash/isEmpty";

import { composeValidators } from "@/components/forms/validations";

import FieldWrapper from "@/components/forms/components/field-wrapper";
import Input from "@/components/forms/components/input";

import "./styles.scss";

class Radio extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    hidden: PropTypes.bool,
    validate: PropTypes.array,
    selectedOption: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.array,
    required: PropTypes.bool,
  };

  render() {
    const { name, label, validate, selectedOption, options, hidden, required } =
      this.props;
    const parsedOptions =
      !isEmpty(options) && !options[0].label && !options[0].value
        ? options.map((o) => ({
            label: o,
            value: o.replace(/( )+|(\/)+/g, "_"),
          }))
        : options;

    return (
      <Field
        name={name}
        validate={composeValidators(required, validate)}
        component="select"
      >
        {({ input, meta }) => (
          <FieldWrapper
            label={label}
            name={name}
            {...meta}
            hidden={hidden}
            required={required}
          >
            <div className="c-form-radio">
              {parsedOptions &&
                parsedOptions.map((option) => {
                  const id = uniqueId(`radio-${option.value}-`);
                  return (
                    <div key={option.value} className="radio-option">
                      <Field
                        id={id}
                        name={input.name}
                        component="input"
                        type="radio"
                        value={option.value}
                      />
                      <label className="radio-label" htmlFor={id}>
                        <span />
                        {option.label}
                      </label>
                      {selectedOption === option.value && option.radioInput && (
                        <Input
                          name={`${input.name}_otherInput`}
                          className="radio-input"
                          required={required}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </FieldWrapper>
        )}
      </Field>
    );
  }
}

export default Radio;
