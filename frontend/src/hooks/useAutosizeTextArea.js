// frontend/src/hooks/useAutosizeTextArea.js
import { useEffect } from "react";

// This hook adjusts the height of a textarea automatically based on its content
const useAutosizeTextArea = (textAreaRef, value) => {
  useEffect(() => {
    if (textAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for shrinking
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;

      // Set the height directly to the calculated scrollHeight
      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);
};

export default useAutosizeTextArea;