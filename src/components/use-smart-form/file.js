import React from "react";
import InputContainer from "./input-container";

const File = ({
  fieldName,
  containerClassName,
  containerStyle,
  labelClassName,
  labelStyle,
  label,
  showFieldErrors,
  error,
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
        type="file"
        onChange={(e) => handleChange(fieldName, e.target.files)}
        className={className}
        style={style}
        aria-invalid={!!error}
        aria-describedby={error ? "name-error" : ""}
        aria-required={fieldValue.required ? "true" : "false"}
      />
    </InputContainer>
  );
};

export default File;
