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
      const errors = {}; // Create an empty errors object

      if (validation.minLength && value.length < validation.minLength) {
        errors[
          key
        ] = `Field must be at least ${validation.minLength} characters long.`;
      }

      if (validation.maxLength && value.length > validation.maxLength) {
        errors[
          key
        ] = `Field must not exceed ${validation.maxLength} characters.`;
      }

      if (validation.min && parseFloat(value) < validation.min) {
        errors[
          key
        ] = `Value must be greater than or equal to ${validation.min}.`;
      }

      if (validation.max && parseFloat(value) > validation.max) {
        errors[key] = `Value must be less than or equal to ${validation.max}.`;
      }

      // Dispatch an "updateError" action to update the errors in the state
      dispatch({ type: "updateError", key, payload: errors[key] });

      // Update the field value only if there are no errors
      if (!errors[key]) {
        dispatch({ type: "updateField", key, payload: value });
      }
    } else {
      dispatch({ type: "updateField", key, payload: value });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission actions here, such as sending data to a server

    // Call the onSubmit callback with the current form state
    if (onSubmit) {
      onSubmit(state);
    }
  };
  const get = (key) => {
    return state[key];
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
    get,
  };
};

export default useSmartForm;
