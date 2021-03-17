import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { circuitEditorStateFromIdSelector } from "@/services/circuit-editors/selectors/editor";

export interface CircuitEditorContext {
  editorId: string;
  circuitId: string;
  circuitNodeIdPath: string[];
}

const circuitEditorContext = React.createContext<CircuitEditorContext>({
  editorId: "~none",
  circuitId: "~none",
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
  const editorState = useSelector((state) =>
    circuitEditorStateFromIdSelector(state, editorId)
  );
  const { circuitId, circuitNodeIdPath } = editorState ?? {
    circuitId: "~none",
    circuitNodeIdPath: [],
  };

  const context = React.useMemo<CircuitEditorContext>(
    () => ({
      editorId,
      circuitId,
      circuitNodeIdPath,
    }),
    [circuitId, circuitNodeIdPath, editorId]
  );

  if (!editorState) {
    return null;
  }

  return (
    <circuitEditorContext.Provider value={context}>
      {children}
    </circuitEditorContext.Provider>
  );
};
