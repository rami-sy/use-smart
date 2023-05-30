import React from "react";
import { useSmartForm } from "./components/use-smart-form";
import SmartForm from "./components/use-smart-form/SmartForm";
const App = () => {
  const handleSubmit = (formData) => {
    // Handle form submission, such as sending data to a server
    console.log("Form submitted:", formData);
  };

  const { form, state } = useSmartForm(
    {
      count: 4,
      name: {
        value: "test",
        validation: { minLength: 3 },
        customValidation: (value) => {
          // Custom validation logic for the field
          // Return an error message if validation fails, or an empty string if it passes
          if (value === "tes") {
            return "Custom validation failed.";
          }
          return "";
        },
        format: (value) => {
          // Remove all non-digit characters from the value
          const numericValue = value.replace(/\D/g, "");

          // Format the numeric value as a phone number
          const formattedValue = `(${numericValue.slice(
            0,
            3
          )}) ${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;

          return formattedValue;
        },
      },
      age: {
        type: "number",
        value: "1",
        validation: { min: 18, max: 99 },

        placeholder: "Enter your age",
      },
    },
    handleSubmit,
    {
      disableValidation: false,
      disableSubmit: false,
      disableReset: false,
    }
  );

  console.log({ state });

  return (
    <div>
      <div>{form}</div>

      <SmartForm
        onSubmit={(state) => {
          console.log({ state });
        }}
      >
        <input name="firstName" />
        <input name="lastName" />
        <input name="email" />
      </SmartForm>
    </div>
  );
};

export default App;
