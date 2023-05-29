# Use Smart

`useSmartForm` is a custom React hook that provides a simple and reusable way to manage form state and handle form functionality in React applications.

## Installation

Install the `use-smart` library using npm:

```bash
npm install use-smart
```

or yarn:

```bash
yarn add use-smart
```

## Usage

```jsx
import React from "react";
import { useSmartForm } from "use-smart";

const MyComponent = () => {
  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
  };

  const { form, state } = useSmartForm(
    {
      email: "",
      password: {
        type: "password",
        className: "password-input",
      },
    },
    handleSubmit
  );

  return (
    <div>
      {form}
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};
```

## Features

- Handles form state
- Handles form submission
- Generates form inputs based on a form format object
- Dont need to change the state of the component
- Handles form validation

## Customizing Form Inputs

You can customize the form inputs by passing a configuration object to the `useSmartForm` hook. The configuration object is used to generate the form inputs.

```jsx
import React from "react";
import { useSmartForm } from "use-smart";

const initialFormFormat = {
  name: {
    type: "text",
    placeholder: "Your name",
    className: "name-input",
  },
  email: {
    type: "email",
    placeholder: "Your email",
  },
  gender: {
    type: "checkbox",
    options: ["male", "female"],
  },
  password: {
    type: "password",
    id: "password",
    placeholder: "Your password",
    validation: {
      minLength: 8,
    },
  },
  city: {
    options: ["istanbul", "madreid", "london", "paris", "berlin", "rome"],
    type: "select",
    placeholder: "Select a city",
    onChange: (e) => {
      console.log(e.target.value);
    },
  },
};

const MyComponent = () => {
  const handleSubmit = (formData) => {
    // Handle form submission, such as sending data to a server
    console.log("Form submitted:", formData);
  };

  const { form, state } = useSmartForm(initialFormFormat, handleSubmit);

  return (
  <div>
    <div>{form}</div>
    <div>
      <p>{state.name}<p/>
      <p>{state.email}<p/>
      <p>{state.name}<p/>
      <div/>
  </div>)
};
```

In this example, the name field uses a text input with a custom placeholder. The email field uses an email input type, and the password field uses a password input type with a minimum length validation rule. The `useSmartForm` hook will generate the form inputs based on this configuration object.

## Contributing

Contributions to useSmartForm are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

[MIT](https://choosealicense.com/licenses/mit/)
