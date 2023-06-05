import React from "react";
import useSmartForm from "./useSmartForm";

const SmartForm = ({ children, onSubmit, options }) => {
  // Convert the children to initialFormFormat
  const initialFormFormat = React.Children.toArray(children).reduce(
    (acc, child) => {
      if (child.props && child.props.name) {
        acc[child.props.name] = "";
      }
      return acc;
    },
    {}
  );

  const { form, state } = useSmartForm(initialFormFormat, onSubmit, options);

  return <div>{form}</div>;
};

export default SmartForm;
