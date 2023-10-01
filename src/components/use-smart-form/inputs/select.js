import React from "react";
import InputContainer from "./input-container";

const Select = ({
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
      <select
        id={fieldName}
        value={data.state[fieldName]}
        onBlur={() => handleFieldBlur(fieldName)}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        className={className}
        style={style}
        aria-invalid={!!error}
        aria-describedby={error ? "name-error" : ""}
        aria-required={fieldValue.required ? "true" : "false"}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </InputContainer>
  );
};

export default Select;
