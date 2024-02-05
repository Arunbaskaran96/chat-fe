import { useEffect, useState } from "react";

const useDebounce = (value) => {
  const [text, setText] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setText(value);
    }, 300);
    return () => clearTimeout(timeout);
  }, [value]);

  return text;
};

export default useDebounce;
