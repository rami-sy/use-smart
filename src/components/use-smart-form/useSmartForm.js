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

import React, { useCallback, useMemo, useState } from "react";
import { useImmerReducer } from "use-immer";
import Input from "./inputs/input";
import Radio from "./inputs/radio";
import Select from "./inputs/select";
import Textarea from "./inputs/textarea";
import File from "./inputs/file";

const useSmartForm = (
  initialFormFormat,
  onSubmit,
  options = {
    hideSubmitButton: false,
    disableValidation: false,
    customSubmitButtonText: "",
    showErrorSummary: true,
    showFieldErrors: true,
    className: "",
  }
) => {
  const {
    hideSubmitButton = false,
    disableValidation = false,
    customSubmitButtonText = "",
    showErrorSummary = true,
    showFieldErrors = true,
    className = "",
  } = options;

  const initialState = useMemo(
    () =>
      Object.entries(initialFormFormat).reduce(
        (acc, [fieldName, fieldValue]) => {
          if (typeof fieldValue === "object" && fieldValue !== null) {
            acc.state[fieldName] = fieldValue.value;
            acc.errors[fieldName] = "";
            acc.format[fieldName] = fieldValue.format || null;
          } else {
            acc.state[fieldName] = fieldValue;
            acc.errors[fieldName] = "";
            acc.format[fieldName] = null;
          }
          return acc;
        },
        {
          state: {},
          errors: {},
          isLoading: false,
          submissionError: null,
          format: {},
        }
      ),
    [initialFormFormat]
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

  const validateField = async (key, value) => {
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

  const handleChange = useCallback((key, value) => {
    if (!disableValidation) {
      validateField(key, value);
    }

    // Handle file input separately
    if (initialFormFormat[key].type === "file") {
      dispatch({ type: "updateField", key, payload: value });
    } else {
      const formattedValue =
        initialState.format[key] &&
        typeof initialState.format[key] === "function"
          ? initialState.format[key](value)
          : value;
      dispatch({ type: "updateField", key, payload: formattedValue });
    }
  }, []);

  const handleFieldBlur = useCallback((key) => {
    if (!showFieldErrors) {
      setFieldTouched((prevFieldTouched) => ({
        ...prevFieldTouched,
        [key]: true,
      }));
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
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
  }, []);

  const reset = () => {
    dispatch({ type: "updateField", payload: initialState.state });
    dispatch({ type: "resetErrors" });
  };

  const renderInput = useCallback(
    (fieldName, fieldValue) => {
      const fieldConfig = initialFormFormat[fieldName];
      const error = data.errors[fieldName];
      const shouldShowField =
        !fieldConfig.showWhen || fieldConfig.showWhen(data.state);

      if (!shouldShowField) {
        return null;
      }

      const commonProps = {
        fieldName,
        containerClassName: fieldValue.containerClassName,
        containerStyle: fieldValue.containerStyle,
        labelClassName: fieldValue.labelClassName,
        labelStyle: fieldValue.labelStyle,
        label: fieldValue.label,
        showFieldErrors: mergedOptions.showFieldErrors,
        error,
        data,
        handleFieldBlur,
        handleChange,
        className: fieldValue.className,
        style: fieldValue.style,
        fieldValue,
      };

      switch (fieldValue.type) {
        case "text":
        case "email":
        case "password":
        case "number":
        case "date":
        case "time":
        case "checkbox":
          return (
            <Input
              {...commonProps}
              type={fieldValue.type}
              placeholder={
                fieldValue.placeholder || fieldName.toLocaleUpperCase()
              }
            />
          );

        case "radio":
          return <Radio {...commonProps} options={fieldValue.options} />;

        case "select":
          return <Select {...commonProps} options={fieldValue.options} />;

        case "textarea":
          return (
            <Textarea
              {...commonProps}
              rows={fieldValue.rows}
              cols={fieldValue.cols}
            />
          );

        case "file":
          return <File {...commonProps} />;

        default:
          return (
            <div key={fieldName}>
              <label htmlFor={fieldName}>{fieldName}</label>
              <input
                id={fieldName}
                type="text"
                placeholder={fieldName.toLocaleUpperCase()}
                value={data.state[fieldName]}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? `${fieldName}-error` : ""}
                aria-required={fieldValue.required ? "true" : "false"}
              />
            </div>
          );
      }
    },
    [data.state, data.errors, mergedOptions.showFieldErrors]
  );

  const renderFormInputs = useMemo(() => {
    return Object.entries(initialFormFormat).map(([fieldName, fieldValue]) => {
      return renderInput(fieldName, fieldValue);
    });
  }, [data.state, data.errors, initialFormFormat, showFieldErrors]);
  const ErrorMessage = ({ fieldName }) => {
    const error = data.errors[fieldName];
    return error ? <div>{error}</div> : null;
  };

  return {
    form: (
      <form onSubmit={handleSubmit}>
        {renderFormInputs}
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
          <button
            type="submit"
            disabled={data.isLoading}
            aria-label={customSubmitButtonText || "Submit"}
            aria-disabled={data.isLoading ? "true" : "false"}
          >
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
