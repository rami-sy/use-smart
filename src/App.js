import React from "react";
import { useSmartForm } from "./components/use-smart-form";
import SmartForm from "./components/use-smart-form/SmartForm";

const App = () => {
  const handleSubmit = (formData) => {
    // Handle form submission, such as sending data to a server
    console.log("Form submitted:", formData, "with errors:", errors);
  };

  const { form, state, errors } = useSmartForm(
    {
      firstName: {
        value: "",
        validation: {
          required: true,
          minLength: 2,
          maxLength: 10,
        },
      },
      lastName: {
        value: "",
        showWhen: (formState) => formState.firstName === "John",
      },
      country: {
        value: "",
        format: (value) => value.toUpperCase(), // Custom formatting function to convert to uppercase
      },
      age: {
        type: "number",
        format: (value) => {
          const prefix = "Age: ";
          if (value.startsWith(prefix)) {
            return value;
          } else {
            return `${prefix}${value}`;
          }
        }, // Custom formatting function to prepend 'Age: ' to the value
      },
      state: {
        value: "",
        type: "select",
        options: ["New York", "California", "Texas"],
      },
      email: {
        value: "",
        type: "email",
        customValidation: (value) => {
          if (!value.includes("@")) {
            return "Please enter a valid email address";
          }
        },
      },
    },
    handleSubmit,
    {
      hideSubmitButton: true,
    }
  );

  console.log({ state, errors });

  return (
    <div>
      <div>
        {form}
        <button onClick={() => handleSubmit(state)}>Submit </button>
      </div>
    </div>
  );
};

export default App;
