import React from "react";
import { Field } from "react-final-form";
import { ChromePicker } from "react-color";
import Gradient from "javascript-color-gradient";

import { composeValidators } from "@/components/forms/validations";
import FieldWrapper from "@/components/forms/components/field-wrapper";

import "./styles.scss";

class ColorGradientPickerComponent extends React.Component {
  state = {
    displayColorPicker1: false,
    displayColorPicker2: false,
    color1: "",
    color2: "",
  };

  handleClickStart = () => {
    this.setState({ displayColorPicker1: !this.state.displayColorPicker1 });
  };

  handleClickEnd = () => {
    this.setState({ displayColorPicker2: !this.state.displayColorPicker2 });
  };

  handleCloseStart = () => {
    this.setState({ displayColorPicker1: false });
  };

  handleCloseEnd = () => {
    this.setState({ displayColorPicker2: false });
  };

  handleChangeStartColor = (color) => {
    this.setState({ color1: color.hex }, this.handleOnGradientChange);
  };

  handleChangeEndColor = (color) => {
    this.setState({ color2: color.hex }, this.handleOnGradientChange);
  };

  handleOnGradientChange = () => {
    const { color1, color2 } = this.state;
    const { onChange } = this.props;
    if (color1 && color2 && onChange) {
      const gradientArray = new Gradient()
        .setColorGradient(color1, color2)
        .setMidpoint(10)
        .getColors();

      onChange(gradientArray);
    }
  };

  render() {
    const { value } = this.props;

    const { displayColorPicker1, displayColorPicker2, color1, color2 } =
      this.state;

    let gradientArray;

    if (color1 && color2) {
      gradientArray = new Gradient()
        .setColorGradient(color1, color2)
        .setMidpoint(10)
        .getColors();
    }

    return (
      <div className="c-gradient-picker">
        <div className="c-color-picker">
          <label className="label">Start Color</label>
          <div className="trigger" onClick={this.handleClickStart}>
            <div className="color" style={{ background: `${color1}` }} />
            <div className="color-hex">{color1}</div>
          </div>
          {displayColorPicker1 ? (
            <div className="popover">
              <div className="cover" onClick={this.handleCloseStart} />
              <ChromePicker
                color={color1}
                onChangeComplete={this.handleChangeStartColor}
                disableAlpha
              />
            </div>
          ) : null}
        </div>
        <div className="c-color-picker">
          <label className="label">End Color</label>
          <div className="trigger" onClick={this.handleClickEnd}>
            <div className="color" style={{ background: `${color2}` }} />
            <div className="color-hex">{color2}</div>
          </div>
          {displayColorPicker2 ? (
            <div className="popover">
              <div className="cover" onClick={this.handleCloseEnd} />
              <ChromePicker
                color={color2}
                onChangeComplete={this.handleChangeEndColor}
                disableAlpha
              />
            </div>
          ) : null}
        </div>

        {gradientArray && (
          <div className="gradient-preview">
            <label className="label">Preview</label>
            <div
              className="gradient-preview-image"
              style={{
                backgroundImage: `linear-gradient(to right, ${gradientArray.join(
                  ","
                )})`,
              }}
            ></div>
          </div>
        )}
      </div>
    );
  }
}

const ColorGradientPicker = ({
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
        <ColorGradientPickerComponent
          colors={input.value}
          onChange={input.onChange}
        />
      </FieldWrapper>
    )}
  </Field>
);

export default ColorGradientPicker;
