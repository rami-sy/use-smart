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
import validateField from "./useValidation";
const renderInputComponents = {
  text: Input,
  email: Input,
  password: Input,
  number: Input,
  date: Input,
  time: Input,
  checkbox: Input,
  undefined: Input,
  radio: Radio,
  select: Select,
  textarea: Textarea,
  file: File,
};
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

  const handleChange = useCallback((key, value) => {
    if (!disableValidation) {
      validateField(
        key,
        value,
        initialFormFormat,
        disableValidation,
        dispatch,
        showFieldErrors
      );
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

  const renderFormInputs = useMemo(() => {
    return Object.entries(initialFormFormat).map(([fieldName, fieldValue]) => {
      if (fieldName === "errors" || fieldName === "isLoading") {
        return null; // Skip rendering errors and loading state
      }

      const fieldConfig = initialFormFormat[fieldName];
      const error = data.errors[fieldName];
      const shouldShowField =
        !fieldConfig.showWhen || fieldConfig.showWhen(data.state);

      if (!shouldShowField) {
        return null;
      }

      if (typeof fieldValue === "object" && fieldValue !== null) {
        const {
          type = "text",
          options,
          placeholder = fieldName.toLocaleUpperCase(),
          className = "",
          style = {},
          containerClassName = "",
          containerStyle = {},
          labelClassName = "",
          labelStyle = {},
          label,
          rows,
          cols,
        } = fieldValue;

        const commonProps = {
          fieldName,
          containerClassName,
          containerStyle,
          labelClassName,
          labelStyle,
          label,
          showFieldErrors,
          error,
          data,
          placeholder,
          handleFieldBlur,
          handleChange,
          className,
          style,
          fieldValue,
          options,
          rows,
          cols,
        };
        const Component = renderInputComponents[type];
        if (Component) {
          return <Component {...commonProps} type={type} />;
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
              aria-invalid={!!error}
              aria-describedby={error ? `${fieldName}-error` : ""}
              aria-required={fieldValue.required ? "true" : "false"}
            />
          </div>
        );
      }
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
