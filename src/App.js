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
      firstName: {
        value: "",
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

        options: ["New York", "California", "Texas"],
      },
      city: {
        value: "",
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
