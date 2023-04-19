/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Field } from "react-final-form";
import cx from "classnames";
import isEmpty from "lodash/isEmpty";

import { composeValidators } from "@/components/forms/validations";
import Input from "@/components/forms/components/input";
import FieldWrapper from "@/components/forms/components/field-wrapper";

import "./styles.scss";

class Select extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    hidden: PropTypes.bool,
    validate: PropTypes.array,
    label: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.array,
    required: PropTypes.bool,
    multiple: PropTypes.bool,
    selectInput: PropTypes.bool,
  };

  render() {
    const {
      name,
      label,
      validate,
      placeholder,
      options,
      hidden,
      required,
      multiple,
      selectInput,
    } = this.props;

    const parsedOptions =
      !isEmpty(options) && !options[0].label && !options[0].value
        ? options.map((o) => ({
            label: o,
            value: o.replace(/( )+|(\/)+/g, "_"),
          }))
        : options;
    const allOptions = parsedOptions || [];
    const optionWithPlaceholder = placeholder
      ? [{ label: placeholder, value: "" }, ...allOptions]
      : allOptions;

    return (
      <Field
        name={name}
        validate={composeValidators(required, validate)}
        component="select"
        type="select"
        multiple={multiple}
      >
        {({ input, meta }) => (
          <FieldWrapper
            label={label}
            name={name}
            {...meta}
            hidden={hidden}
            required={required}
          >
            {multiple && (
              <p className="label sublabel">
                Select all that apply; select multiple by holding
                shift/selecting other options.
              </p>
            )}
            <select
              className={cx("c-form-select", { multiple })}
              {...input}
              multiple={multiple}
            >
              {optionWithPlaceholder.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {selectInput && (
              <div className="select-input">
                <Input
                  name={`${input.name}_otherInput`}
                  label="Other:"
                  required={required}
                />
              </div>
            )}
          </FieldWrapper>
        )}
      </Field>
    );
  }
}

export default Select;
