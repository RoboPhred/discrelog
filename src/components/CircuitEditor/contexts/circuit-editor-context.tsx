import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";
import { circuitEditorStateFromIdSelector } from "@/services/circuit-editors/selectors/editor";
import { string } from "yup";

export interface CircuitEditorContext {
  editorId: string;
  circuitId: string;
  circuitNodeIdPath: string[];
}

const circuitEditorContext = React.createContext<CircuitEditorContext>({
  editorId: "~none",
  circuitId: ROOT_CIRCUIT_ID,
  circuitNodeIdPath: [],
});

export function useCircuitEditor(): CircuitEditorContext {
  return React.useContext(circuitEditorContext);
}

export interface CircuitEditorProviderProps {
  editorId: string;
}
export const CircuitEditorProvider: React.FC<CircuitEditorProviderProps> = ({
  editorId,
  children,
}) => {
  const { circuitId, circuitNodeIdPath } = useSelector((state) =>
    circuitEditorStateFromIdSelector(state, editorId)
  );
  const context = React.useMemo<CircuitEditorContext>(
    () => ({
      editorId,
      circuitId,
      circuitNodeIdPath,
    }),
    [circuitId, circuitNodeIdPath, editorId]
  );
  return (
    <circuitEditorContext.Provider value={context}>
      {children}
    </circuitEditorContext.Provider>
  );
};
