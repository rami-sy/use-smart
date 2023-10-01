import React from "react";

const Checkbox = ({
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
        type="checkbox"
        checked={data.state[fieldName]}
        onBlur={() => handleFieldBlur(fieldName)}
        onChange={(e) => handleChange(fieldName, e.target.checked)}
        className={className}
        style={style}
        aria-invalid={!!error}
        aria-describedby={error ? "name-error" : ""}
        aria-required={fieldValue.required ? "true" : "false"}
      />
    </InputContainer>
  );
};

export default Checkbox;
