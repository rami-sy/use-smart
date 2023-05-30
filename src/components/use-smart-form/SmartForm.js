import React from "react";
import useSmartForm from "./useSmartForm";

const SmartForm = ({ children, onSubmit }) => {
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

  const { form, state } = useSmartForm(initialFormFormat, onSubmit);

  return <div>{form}</div>;
};

export default SmartForm;
