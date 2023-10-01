import React from "react";
import InputContainer from "./input-container";

const Textarea = ({
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
  rows,
  cols,
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
      <textarea
        id={fieldName}
        value={data.state[fieldName]}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        onBlur={() => handleFieldBlur(fieldName)}
        className={className}
        style={style}
        aria-invalid={!!error}
        aria-describedby={error ? "name-error" : ""}
        aria-required={fieldValue.required ? "true" : "false"}
        rows={fieldValue.rows || 4}
        cols={fieldValue.cols || 50}
      />
    </InputContainer>
  );
};

export default Textarea;
