import React from "react";
import { Field } from "react-final-form";
import { ChromePicker } from "react-color";

import { composeValidators } from "@/components/forms/validations";
import FieldWrapper from "@/components/forms/components/field-wrapper";

import "./styles.scss";

class ColorPickerComponent extends React.Component {
  state = {
    displayColorPicker: false,
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    const { onChange } = this.props;

    onChange(color.rgb);
  };

  render() {
    const { value } = this.props;

    const backgroundColor =
      value && `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`;

    return (
      <div className="c-color-picker">
        <div className="trigger" onClick={this.handleClick}>
          <div
            className="color"
            style={{
              background: backgroundColor,
            }}
          />
          <div className="color-hex">
            {value.r} {value.g} {value.b} {value.a}
          </div>
        </div>
        {this.state.displayColorPicker ? (
          <div className="popover">
            <div className="cover" onClick={this.handleClose} />
            <ChromePicker color={value} onChangeComplete={this.handleChange} />
          </div>
        ) : null}
      </div>
    );
  }
}

const ColorPicker = ({
  name,
  label,
  validate,
  type,
  placeholder,
  hidden,
  required,
  infoClick,
  collapse,
  disabled,
  helpText,
  className,
}) => (
  <Field name={name} validate={composeValidators(required, validate)}>
    {({ input, meta }) => (
      <FieldWrapper
        label={label}
        name={name}
        {...meta}
        hidden={hidden}
        required={required}
        infoClick={infoClick}
        collapse={collapse}
        value={input.value}
      >
        <ColorPickerComponent value={input.value} onChange={input.onChange} />
      </FieldWrapper>
    )}
  </Field>
);

export default ColorPicker;
