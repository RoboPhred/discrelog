import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";
import * as React from "react";

export interface CircuitEditorContext {
  circuitId: string;
  circuitNodeIdPath: string[];
}

const circuitEditorContext = React.createContext<CircuitEditorContext>({
  circuitId: ROOT_CIRCUIT_ID,
  circuitNodeIdPath: [],
});

export function useCircuitEditor(): CircuitEditorContext {
  return React.useContext(circuitEditorContext);
}

type CircuitEditorProviderProps = CircuitEditorContext;
export const CircuitEditorProvider: React.FC<CircuitEditorProviderProps> = ({
  circuitId,
  circuitNodeIdPath,
  children,
}) => {
  const context = React.useMemo<CircuitEditorContext>(
    () => ({
      circuitId,
      circuitNodeIdPath,
    }),
    [circuitId, circuitNodeIdPath]
  );
  return (
    <circuitEditorContext.Provider value={context}>
      {children}
    </circuitEditorContext.Provider>
  );
};
