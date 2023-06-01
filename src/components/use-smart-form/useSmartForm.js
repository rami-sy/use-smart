/**
 * useSmartForm Hook
 *
 * A custom hook for managing form state, validation, and submission.
 *
 * @param {object} initialFormFormat - The initial form structure.
 * @param {function} onSubmit - The callback function to handle form submission.
 * @param {object} [options] - Additional options for customizing form behavior.
 * @param {boolean} [options.hideSubmitButton=false] - Whether to hide the submit button.
 * @param {boolean} [options.disableValidation=false] - Whether to disable form field validation.
 * @param {string} [options.customSubmitButtonText=""] - Custom text for the submit button.
 * @param {boolean} [options.showErrorSummary=true] - Whether to display a summary of form errors.
 * @param {boolean} [options.showFieldErrors=true] - Whether to display individual field errors inline with form inputs.
 *
 * @returns {object} - An object containing the form JSX, form state, errors, loading state, and a reset function.
 */

import React, { useState } from "react";
import { useImmerReducer } from "use-immer";

const useSmartForm = (
  initialFormFormat,
  onSubmit,
  options = {
    hideSubmitButton: false,
    disableValidation: false,
    customSubmitButtonText: "",
    showErrorSummary: true,
    showFieldErrors: true,
  }
) => {
  const {
    hideSubmitButton = false,
    disableValidation = false,
    customSubmitButtonText = "",
    showErrorSummary = true,
    showFieldErrors = true,
  } = options;

  const initialState = Object.entries(initialFormFormat).reduce(
    (acc, [fieldName, fieldValue]) => {
      if (typeof fieldValue === "object" && fieldValue !== null) {
        acc.state[fieldName] = fieldValue.value;
        acc.errors[fieldName] = "";
      } else {
        acc.state[fieldName] = fieldValue;
        acc.errors[fieldName] = "";
      }
      return acc;
    },
    { state: {}, errors: {}, isLoading: false, submissionError: null }
  );

  const reducer = (draft, action) => {
    switch (action.type) {
      case "updateField":
        draft.state[action.key] = action.payload;
        break;
      case "updateError":
        draft.errors[action.key] = action.payload;
        break;
      case "updateLoading":
        draft.isLoading = action.payload;
        break;
      case "resetErrors":
        draft.errors = { ...initialState.errors };
        break;
      case "updateSubmissionError":
        draft.submissionError = action.payload;
        break;
      default:
        throw new Error(`Invalid action type: ${action.type}`);
    }
  };
  const [fieldTouched, setFieldTouched] = useState({}); // Track touched fields

  const [data, dispatch] = useImmerReducer(reducer, initialState);

  const validateField = (key, value) => {
    const fieldConfig = initialFormFormat[key];
    let error = "";

    if (fieldConfig && fieldConfig.validation && !disableValidation) {
      const { validation, customValidation } = fieldConfig;

      if (customValidation && typeof customValidation === "function") {
        error = customValidation(value);
      }

      if (!error) {
        if (validation.minLength && value.length < validation.minLength) {
          error = `Field must be at least ${validation.minLength} characters long.`;
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
      }

      dispatch({ type: "updateError", key, payload: error });

      return !error;
    }
    if (showFieldErrors || fieldTouched[key]) {
      dispatch({ type: "updateError", key, payload: error });
    }

    return true;
  };

  const handleChange = (key, value) => {
    if (!disableValidation) {
      validateField(key, value);
    }

    // Handle file input separately
    if (initialFormFormat[key].type === "file") {
      dispatch({ type: "updateField", key, payload: value });
    } else {
      dispatch({ type: "updateField", key, payload: value });
    }
  };
  const handleFieldBlur = (key) => {
    if (!showFieldErrors) {
      setFieldTouched((prevFieldTouched) => ({
        ...prevFieldTouched,
        [key]: true,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "updateLoading", payload: true });

    const touchedFields = Object.keys(initialFormFormat).reduce(
      (acc, fieldName) => {
        acc[fieldName] = true;
        return acc;
      },
      {}
    );
    setFieldTouched(touchedFields);
    try {
      // Perform form submission actions here, such as sending data to a server
      // Simulating an asynchronous submission with setTimeout
      // Replace this with your actual form submission logic

      dispatch({ type: "updateLoading", payload: false });

      // Call the onSubmit callback with the current form state
      if (onSubmit) {
        onSubmit(data.state);
      }
    } catch (error) {
      dispatch({ type: "updateLoading", payload: false });
      dispatch({ type: "updateSubmissionError", payload: error.message });
    }
  };

  const reset = () => {
    dispatch({ type: "updateField", payload: initialState.state });
    dispatch({ type: "resetErrors" });
  };

  const renderFormInputs = () => {
    return Object.entries(data.state).map(([fieldName, fieldValue]) => {
      if (fieldName === "errors" || fieldName === "isLoading") {
        return null; // Skip rendering errors and loading state
      }

      if (typeof fieldValue === "object" && fieldValue !== null) {
        const {
          type,
          options,
          placeholder = fieldName.toLocaleUpperCase(),
          className = "",
          label,
          format, // Add the format property
        } = fieldValue;
        const formattedValue = format
          ? format(data.state[fieldName])
          : data.state[fieldName]; // Apply formatting if a format function is provided

        switch (type) {
          case "text":
            return (
              <div key={fieldName}>
                <label htmlFor={fieldName}>{label}</label>
                <input
                  id={fieldName}
                  type={type}
                  value={formattedValue}
                  placeholder={placeholder}
                  onBlur={() => handleFieldBlur(fieldName)}
                  onChange={(e) => handleChange(fieldName, e.target.value)}
                  className={className}
                />
                {showFieldErrors && (
                  <ErrorMessage fieldName={fieldName} /> // Show individual field error
                )}
              </div>
            );
          case "checkbox":
            return (
              <div key={fieldName} className={className}>
                <label htmlFor={fieldName}>{label}</label>
                <input
                  id={fieldName}
                  type="checkbox"
                  checked={formattedValue}
                  onBlur={() => handleFieldBlur(fieldName)}
                  onChange={(e) => handleChange(fieldName, e.target.checked)}
                />
                {showFieldErrors && (
                  <ErrorMessage fieldName={fieldName} /> // Show individual field error
                )}
              </div>
            );
          case "radio":
            return (
              <div key={fieldName} className={className}>
                <label>{label}</label>
                {options.map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      value={option}
                      checked={formattedValue === option}
                      onBlur={() => handleFieldBlur(fieldName)}
                      onChange={(e) => handleChange(fieldName, e.target.value)}
                    />
                    {option}
                  </label>
                ))}
                {showFieldErrors && (
                  <ErrorMessage fieldName={fieldName} /> // Show individual field error
                )}
              </div>
            );
          case "select":
            return (
              <div key={fieldName} className={className}>
                <label htmlFor={fieldName}>{label}</label>
                <select
                  id={fieldName}
                  value={formattedValue}
                  onBlur={() => handleFieldBlur(fieldName)}
                  onChange={(e) => handleChange(fieldName, e.target.value)}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {showFieldErrors && (
                  <ErrorMessage fieldName={fieldName} /> // Show individual field error
                )}
              </div>
            );
          case "date":
            return (
              <div key={fieldName}>
                <label htmlFor={fieldName}>{label}</label>
                <input
                  id={fieldName}
                  type="date"
                  value={formattedValue}
                  onBlur={() => handleFieldBlur(fieldName)}
                  onChange={(e) => handleChange(fieldName, e.target.value)}
                  className={className}
                />
                {showFieldErrors && <ErrorMessage fieldName={fieldName} />}
              </div>
            );

          case "file":
            return (
              <div key={fieldName}>
                <label htmlFor={fieldName}>{label}</label>
                <input
                  id={fieldName}
                  type="file"
                  onChange={(e) => handleChange(fieldName, e.target.files)}
                  className={className}
                />
                {showFieldErrors && <ErrorMessage fieldName={fieldName} />}
              </div>
            );
          default:
            return (
              <div key={fieldName}>
                <label htmlFor={fieldName}>{label}</label>
                <input
                  id={fieldName}
                  type="text"
                  value={formattedValue}
                  placeholder={placeholder}
                  onBlur={() => handleFieldBlur(fieldName)}
                  onChange={(e) => handleChange(fieldName, e.target.value)}
                  className={className}
                />
              </div>
            );
        }
      } else {
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName}>{fieldName}</label>
            <input
              id={fieldName}
              type="text"
              placeholder={fieldName.toLocaleUpperCase()}
              value={data.state[fieldName]}
              onChange={(e) => handleChange(fieldName, e.target.value)}
            />
          </div>
        );
      }
    });
  };

  const ErrorMessage = ({ fieldName }) => {
    const error = data.errors[fieldName];
    return error ? <div>{error}</div> : null;
  };

  return {
    form: (
      <form onSubmit={handleSubmit}>
        {renderFormInputs()}
        {showErrorSummary &&
          Object.values(data.errors).some((error) => error !== "") && (
            <div style={{ color: "red" }}>
              {data.submissionError && <div>{data.submissionError}</div>}
              {Object.keys(data.errors).map((fieldName) => (
                <ErrorMessage key={fieldName} fieldName={fieldName} />
              ))}
            </div>
          )}
        {!hideSubmitButton && (
          <button type="submit" disabled={data.isLoading}>
            {data.isLoading ? "Loading..." : customSubmitButtonText || "Submit"}
          </button>
        )}
      </form>
    ),
    state: { ...data.state },
    errors: { ...data.errors },
    isLoading: data.isLoading,
    reset,
  };
};

export default useSmartForm;
