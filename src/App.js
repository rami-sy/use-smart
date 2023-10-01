import React from "react";
import { useSelect } from "./use-smart";

const MySelectComponent = () => {
  const { selectRef, getValue, setValue } = useSelect();

  const handleButtonClick = () => {
    console.log("Selected value:", getValue());
    setValue("Option2"); // Replace "Option2" with any value you want to set
  };

  console.log("selectRef:", selectRef, "getValue:", getValue());
  return (
    <div>
      <select ref={selectRef}>
        <option value="Option1">Option 1</option>
        <option value="Option2">Option 2</option>
        <option value="Option3">Option 3</option>
      </select>
      <button onClick={handleButtonClick}>Get and Set Value</button>
    </div>
  );
};

export default MySelectComponent;
