import React from "react";
import { useImmerReducer } from "use-immer";

const useSmartForm = (
  initialFormFormat,
  onSubmit,
  options = {
    hideSubmitButton: false,
    disableValidation: false,
    customSubmitButtonText: "",
    showErrorSummary: true,
  }
) => {
  const {
    hideSubmitButton = false,
    disableValidation = false,
    customSubmitButtonText = "",
    showErrorSummary = true,
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
    { state: {}, errors: {}, isLoading: false }
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
      default:
        throw new Error(`Invalid action type: ${action.type}`);
    }
  };

  const [data, dispatch] = useImmerReducer(reducer, initialState);

  const validateField = (key, value) => {
    const fieldConfig = initialFormFormat[key];

    if (fieldConfig && fieldConfig.validation && !disableValidation) {
      const { validation, customValidation } = fieldConfig;
      let error = "";

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

    return true;
  };

  const handleChange = (key, value) => {
    if (!disableValidation) {
      validateField(key, value);
    }
    dispatch({ type: "updateField", key, payload: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "updateLoading", payload: true });

    // Perform form submission actions here, such as sending data to a server
    // Simulating an asynchronous submission with setTimeout
    setTimeout(() => {
      dispatch({ type: "updateLoading", payload: false });

      // Call the onSubmit callback with the current form state
      if (onSubmit) {
        onSubmit(data.state);
      }
    }, 1000);
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
                  onChange={(e) => handleChange(fieldName, e.target.value)}
                  className={className}
                />
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
                  onChange={(e) => handleChange(fieldName, e.target.checked)}
                />
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
                      onChange={(e) => handleChange(fieldName, e.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            );
          case "select":
            return (
              <div key={fieldName} className={className}>
                <label htmlFor={fieldName}>{label}</label>
                <select
                  id={fieldName}
                  value={formattedValue}
                  onChange={(e) => handleChange(fieldName, e.target.value)}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
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
