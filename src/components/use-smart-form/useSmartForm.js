import React from "react";
import { useImmerReducer } from "use-immer";

const useSmartForm = (initialFormFormat, onSubmit) => {
  const initialState = Object.entries(initialFormFormat).reduce(
    (acc, [fieldName, fieldValue]) => {
      if (typeof fieldValue === "object" && fieldValue !== null) {
        acc[fieldName] = fieldValue.value;
      } else {
        acc[fieldName] = fieldValue;
      }
      return acc;
    },
    {}
  );

  function reducer(draft, action) {
    switch (action.type) {
      case "updateField":
        draft[action.key] = action.payload;
        break;
      default:
        throw new Error(`Invalid action type: ${action.type}`);
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const handleChange = (key, value) => {
    const fieldConfig = initialFormFormat[key];

    if (fieldConfig && fieldConfig.validation) {
      const { validation } = fieldConfig;

      if (validation.minLength && value.length < validation.minLength) {
        // Handle validation error for minLength
        return;
      }

      if (validation.maxLength && value.length > validation.maxLength) {
        // Handle validation error for maxLength
        return;
      }

      if (validation.min && parseFloat(value) < validation.min) {
        // Handle validation error for min
        return;
      }

      if (validation.max && parseFloat(value) > validation.max) {
        // Handle validation error for max
        return;
      }
    }

    dispatch({ type: "updateField", key, payload: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission actions here, such as sending data to a server

    // Call the onSubmit callback with the current form state
    if (onSubmit) {
      onSubmit(state);
    }
  };
  const renderFormInputs = () => {
    return Object.entries(state).map(([fieldName, fieldValue]) => {
      if (typeof fieldValue === "object" && fieldValue !== null) {
        const {
          type,
          options,
          placeholder = fieldName.toLocaleUpperCase(),
          className = "",
        } = fieldValue;

        switch (type) {
          case "text":
            return (
              <input
                key={fieldName}
                type={type}
                value={state[fieldName]}
                placeholder={placeholder}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                className={className}
              />
            );
          case "checkbox":
            return (
              <label key={fieldName} className={className}>
                <input
                  type="checkbox"
                  checked={state[fieldName]}
                  onChange={(e) => handleChange(fieldName, e.target.checked)}
                />
                {fieldName}
              </label>
            );
          case "radio":
            return (
              <div key={fieldName} className={className}>
                {options.map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      value={option}
                      checked={state[fieldName] === option}
                      onChange={(e) => handleChange(fieldName, e.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            );
          case "select":
            return (
              <select
                key={fieldName}
                value={state[fieldName]}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                className={className}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            );
          default:
            return (
              <input
                key={fieldName}
                type="text"
                value={state[fieldName]}
                placeholder={placeholder}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                className={className}
              />
            );
        }
      } else {
        return (
          <input
            key={fieldName}
            type="text"
            placeholder={fieldName.toLocaleUpperCase()}
            value={state[fieldName]}
            onChange={(e) => handleChange(fieldName, e.target.value)}
          />
        );
      }
    });
  };

  return {
    form: (
      <form onSubmit={handleSubmit}>
        {renderFormInputs()}
        <button type="submit">Submit</button>
      </form>
    ),
    state,
  };
};

export default useSmartForm;
