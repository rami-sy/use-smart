const validateField = async (
  key,
  value,
  initialFormFormat,
  disableValidation,
  dispatch,
  showFieldErrors
) => {
  const fieldConfig = initialFormFormat[key];
  let error = "";

  if (fieldConfig && fieldConfig.validation && !disableValidation) {
    const { validation } = fieldConfig;

    if (!error) {
      if (validation.minLength && value.length < validation.minLength) {
        error = `Field must be at least ${validation.minLength} characters long.`;
      }

      // add required validation
      if (validation.required && !value) {
        error = "Field is required.";
      }

      // add rgx validation
      if (validation.regex && !validation.regex.test(value)) {
        error = validation.rgxError || "Invalid value.";
      }

      // add email validation
      if (validation.email && !value.includes("@")) {
        error = "Field must be a valid email address.";
      }

      if (validation.maxLength && value.length > validation.maxLength) {
        error = `Field must not exceed ${validation.maxLength} characters.`;
      }

      if (validation.min && parseFloat(value) < validation.min) {
        error = `Value must be greater than or equal to ${validation.min}.`;
      }

      if (validation.max && parseFloat(value) > validation.max) {
        error = `Value must be less than or equal to ${validation.max}.`;
      }

      if (validation.pattern && !validation.pattern.test(value)) {
        error = validation.patternError || "Invalid value.";
      }
    }

    dispatch({ type: "updateError", key, payload: error });

    return !error;
  }
  if (
    fieldConfig &&
    typeof fieldConfig.customValidation === "function" &&
    !disableValidation
  ) {
    const { customValidation } = fieldConfig;

    try {
      // Check if the custom validation function returns a promise
      const validationPromise = customValidation(value);

      if (validationPromise instanceof Promise) {
        // If it's a promise, await its resolution
        error = await validationPromise;
      } else {
        // If not a promise, use the returned value
        error = validationPromise;
      }
    } catch (err) {
      // Handle any errors thrown during validation
      error = err.message;
    }
  }

  if (showFieldErrors || fieldTouched[key]) {
    dispatch({ type: "updateError", key, payload: error });
  }

  return true;
};

export default validateField;
