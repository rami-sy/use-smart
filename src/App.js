import React from "react";
import { useSmartForm } from "./components/use-smart-form";
const App = () => {
  const handleSubmit = (formData) => {
    // Handle form submission, such as sending data to a server
    console.log("Form submitted:", formData);
  };

  const { form, state } = useSmartForm(
    {
      count: 4,
      name: { value: "test", validation: { minLength: 3 } },
      age: {
        type: "number",
        value: "6",
        validation: { min: 18, max: 99 },
        placeholder: "Enter your age",
      },
    },
    handleSubmit
  );

  console.log({ state });

  return (
    <div>
      <div>{form}</div>
    </div>
  );
};

export default App;
