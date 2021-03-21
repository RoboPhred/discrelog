import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { circuitEditorStateFromIdSelector } from "@/services/circuit-editors/selectors/editor";

export interface CircuitEditorContext {
  editorId: string;
  circuitId: string;
  elementIdPath: string[];
}

const circuitEditorContext = React.createContext<CircuitEditorContext>({
  editorId: "~none",
  circuitId: "~none",
  elementIdPath: [],
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
  const { circuitId, elementIdPath } = editorState ?? {
    circuitId: "~none",
    elementIdPath: [],
  };

  const context = React.useMemo<CircuitEditorContext>(
    () => ({
      editorId,
      circuitId,
      elementIdPath: elementIdPath,
    }),
    [circuitId, elementIdPath, editorId]
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
