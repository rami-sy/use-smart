import React from "react";
import FieldErrorMessage from "./field-error-message";

const InputContainer = ({
  children,
  fieldName,
  containerClassName,
  containerStyle,
  labelClassName,
  labelStyle,
  label,
  showFieldErrors,
  error,
}) => {
  return (
    <div
      key={fieldName}
      className={`${containerClassName}`}
      style={containerStyle}
    >
      <label
        className={`${labelClassName}`}
        style={labelStyle}
        htmlFor={fieldName}
      >
        {label}
      </label>
      {children}
      {showFieldErrors && <FieldErrorMessage error={error} />}
    </div>
  );
};

export default InputContainer;
