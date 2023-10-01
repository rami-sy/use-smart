import React from "react";
import InputContainer from "./input-container";

const Input = ({
  fieldName,
  containerClassName,
  containerStyle,
  labelClassName,
  labelStyle,
  label,
  showFieldErrors,
  error,
  data,
  type,
  placeholder,
  handleFieldBlur,
  handleChange,
  className,
  style,
  fieldValue,
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
      <input
        id={fieldName}
        type={type}
        value={data.state[fieldName]}
        placeholder={placeholder}
        onBlur={() => handleFieldBlur(fieldName)}
        onChange={(e) =>
          handleChange(
            fieldName,
            type === "checkbox" ? e.target.checked : e.target.value
          )
        }
        className={className}
        style={style}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldName}-error` : ""}
        aria-required={fieldValue.required ? "true" : "false"}
      />
    </InputContainer>
  );
};

export default Input;
