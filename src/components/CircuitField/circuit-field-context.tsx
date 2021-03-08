import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";
import * as React from "react";

export interface CircuitFieldContext {
  circuitId: string;
  circuitNodePath: string[];
}

const circuitFieldContext = React.createContext<CircuitFieldContext>({
  circuitId: ROOT_CIRCUIT_ID,
  circuitNodePath: [],
});

export function useCircuitField(): CircuitFieldContext {
  return React.useContext(circuitFieldContext);
}

type CircuitFieldProviderProps = CircuitFieldContext;
export const CircuitFieldProvider: React.FC<CircuitFieldProviderProps> = ({
  circuitId,
  circuitNodePath,
  children,
}) => {
  const context = React.useMemo<CircuitFieldContext>(
    () => ({
      circuitId,
      circuitNodePath,
    }),
    [circuitId, circuitNodePath]
  );
  return (
    <circuitFieldContext.Provider value={context}>
      {children}
    </circuitFieldContext.Provider>
  );
};
