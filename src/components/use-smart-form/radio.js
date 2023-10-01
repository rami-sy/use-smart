import React from "react";
import InputContainer from "./input-container";

const Radio = ({
  fieldName,
  containerClassName,
  containerStyle,
  labelClassName,
  labelStyle,
  label,
  showFieldErrors,
  error,
  data,
  handleFieldBlur,
  handleChange,
  className,
  style,
  fieldValue,
  options,
}) => {
  return (
    <InputContainer
      fieldName={fieldName}
      containerClassName={containerClassName}
      containerStyle={containerStyle}
      labelClassName={labelClassName}
      labelStyle={labelStyle}
      label={label}
      showFieldErrors={showFieldErrors}
      error={error}
    >
      {options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            value={option}
            checked={data.state[fieldName] === option}
            onBlur={() => handleFieldBlur(fieldName)}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className={className}
            style={style}
            aria-invalid={!!error}
            aria-describedby={error ? "name-error" : ""}
            aria-required={fieldValue.required ? "true" : "false"}
          />
          {option}
        </label>
      ))}
    </InputContainer>
  );
};

export default Radio;
