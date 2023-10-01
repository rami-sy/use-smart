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
    className: "name-input",
  },
  email: {
    type: "email",
    placeholder: "Your email",
    className: "p-3 mx-2",
    containerClassName: "flex flex-col",
    labelClassName: "text-gray-700",
  },
  gender: {
    type: "radio",
    options: ["male", "female"],
    containerStyle: {
      display: "flex",
      flexDirection: "column",
    },
    labelStyle: {
      color: "red",
    },
    style: {
      border: "1px solid red",
    },

  },
  isGraduated: {
    type: "checkbox",
    label: "Are you graduated?",
    value: false,
    required: true,
  },

  password: {
    type: "password",
    id: "password",
    placeholder: "Your password",
    validation: {
      minLength: 8,
    },
    containerStyle: {
      display: "flex",
      flexDirection: "column",
    },
    labelStyle: {
      color: "red",
    },
    style: {
      border: "1px solid red",
    },
  },
  city: {
    options: ["istanbul", "madrid", "london", "paris", "berlin", "rome"],
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

## Options

The `useSmartForm` hook and `SmartForm` component accept an optional options object as the third argument. This object can be used to customize the behavior of the form. The available options are:

`hideSubmitButton` (boolean, default: `false`): Whether to hide the submit button.
`disableValidation` (boolean, default: `false`): Whether to disable form field validation.
`customSubmitButtonText` (string, default: `""`): The text to display on the submit button.
`showErrorSummary` (boolean, default: `true`): Whether to show a summary of form errors.

```jsx
const options = {
  hideSubmitButton: false,
  disableValidation: false,
  customSubmitButtonText: "",
  showErrorSummary: true,
  showFieldErrors: true,
};

useSmartForm(initialFormFormat, handleSubmit, options);
```

## Examples

```jsx
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
```

## API Reference

### useSmartForm

```jsx
const { form, state, errors, isLoading, reset } = useSmartForm(
  initialFormFormat,
  handleSubmit,
  options
);
```

The `useSmartForm` hook accepts three arguments:

`initialFormFormat` (object): The initial form format object.
`handleSubmit` (function): The function to call when the form is submitted.
`options` (object, optional): An object containing options to customize the behavior of the form.

The `useSmartForm` hook returns an object with the following properties:

`form` (JSX): The form JSX.
`state` (object): The current form state.
`errors` (object): The current form errors.
`isLoading` (boolean): Whether the form is currently submitting.
`reset` (function): A function to reset the form to its initial state.

### SmartForm

```jsx
<SmartForm
  initialFormFormat={initialFormFormat}
  handleSubmit={handleSubmit}
  options={options}
/>
```

The `SmartForm` component accepts three props:

`initialFormFormat` (object): The initial form format object.
`handleSubmit` (function): The function to call when the form is submitted.
`options` (object, optional): An object containing options to customize the behavior of the form.

## Form Format

The form format object is used to define the form fields. It is an object with the following structure:

```jsx
const initialFormFormat = {
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
};
```

Each key in the form format object represents a form field. The value of each key is an object with the following properties:

`value` (string): The initial value of the form field.
`validation` (object, optional): An object containing validation rules for the form field.
`showWhen` (function, optional): A function that determines whether to show the form field.
`format` (function, optional): A function that formats the value of the form field.
`type` (string, optional): The type of the form field. Can be one of: `text`, `number`, `email`, `password`, `select`, `checkbox`, `radio`, `textarea`.
`options` (array, optional): An array of options for the form field.
`customValidation` (function, optional): A function that performs custom validation on the form field.

## Validation

The `validation` property of a form field is an object with the following structure:

```jsx
const validation = {
  required: true,
  minLength: 2,
  maxLength: 10,
};
```

Each key in the validation object represents a validation rule. The value of each key is a boolean that determines whether the validation rule should be applied.

The following validation rules are supported:

`required` (boolean): Whether the form field is required.
`minLength` (number): The minimum length of the form field.
`maxLength` (number): The maximum length of the form field.
`pattern` (string): A regular expression that the form field must match.
`min` (number): The minimum value of the form field.
`max` (number): The maximum value of the form field.

## Contributing

Contributions to useSmartForm are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

[MIT](https://choosealicense.com/licenses/mit/)

```

```
