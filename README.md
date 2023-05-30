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

use `SmartForm` instead of `useSmartForm` hook if you want to use it as a component.

```jsx
import React from "react";
import { SmartForm } from "use-smart";
const MyComponent = () => {
  return (
    <SmartForm
      onSubmit={(state) => {
        console.log({ state });
      }}
    >
      <input name="firstName" />
      <input name="lastName" />
      <input name="email" />
    </SmartForm>
  );
};

export default App;
```

in example above, you can use `onSubmit` prop to get form state. no need to use onChange or value props for inputs. use-smart will handle it for you.

## Features

- Handles form state
- Handles form submission
- Generates form inputs based on a form format object
- Supports different input types such as text, checkbox, radio, and select
- Customizable options for submit button, error display, and more
- Supports custom form inputs
- Provides loading state feedback
- Provides a reset function to reset the form to its initial state
- Supports form validation rules such as required, minLength, maxLength, and pattern
- Provides a summary of form errors

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

```jsx
import React from "react";
import { useSmartForm } from "use-smart";

const MyComponent = () => {
  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
  };

  const initialFormFormat = {
    email: "",
    password: {
      type: "password",
      className: "password-input",
    },
  };

  const options = {
    hideSubmitButton: false,
    disableValidation: true,
    customSubmitButtonText: "Save",
    showErrorSummary: true,
  };

  const { form, state, isLoading, reset } = useSmartForm(
    initialFormFormat,
    handleSubmit,
    options
  );

  return (
    <div>
      {form}
      {isLoading ? <p>Loading...</p> : null}
      <button onClick={reset}>Reset</button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};
```

In this example, we've added options to customize the behavior of the form. The `hideSubmitButton` option determines whether to show the submit button. The `disableValidation` option disables form validation. The `customSubmitButtonText` option allows specifying a custom text for the submit button. The `showErrorSummary` option controls whether to show a summary of form errors.

The `reset` function is used to reset the form to its initial state.

## Contributing

Contributions to useSmartForm are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

[MIT](https://choosealicense.com/licenses/mit/)
