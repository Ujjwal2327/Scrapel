import { useState } from "react";
import { createContext } from "react";

export const flowValidationContext = createContext(null);

export function FlowValidationContextProvider({ children }) {
  const [invalidInputs, setInvalidInputs] = useState([]);

  const clearErrors = () => setInvalidInputs([]);

  return (
    <flowValidationContext.Provider
      value={{ invalidInputs, setInvalidInputs, clearErrors }}
    >
      {children}
    </flowValidationContext.Provider>
  );
}
