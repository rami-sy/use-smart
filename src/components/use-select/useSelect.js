import { useRef } from "react";

function useSelect() {
  const selectRef = useRef(null);

  const getValue = () => {
    if (selectRef?.current) {
      return selectRef?.current?.value;
    }
    return null;
  };

  const setValue = (newValue) => {
    if (selectRef?.current) {
      selectRef.current.value = newValue;
    }
  };

  return {
    selectRef,
    getValue,
    setValue,
  };
}

export default useSelect;
