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
      country: {
        value: "",
        options: ["USA", "Canada", "Mexico"],
      },
      state: {
        value: "",
        dependency: {
          field: "country",
          value: "USA",
        },
        options: ["New York", "California", "Texas"],
      },
      city: {
        value: "",
        dependency: {
          field: "country",
          value: "USA",
        },
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
