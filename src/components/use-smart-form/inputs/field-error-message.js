import React from "react";

const FieldErrorMessage = ({ error }) => {
  return error ? <div style={{ color: "red" }}>{error}</div> : null;
};

export default FieldErrorMessage;
