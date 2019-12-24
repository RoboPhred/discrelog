import {
  CircuitFieldState,
  defaultCircuitFieldState
} from "./components/CircuitFieldView/components/CircuitField/state";

export interface CircuitEditorState {
  mouseOverNodeId: string | null;
  selectedNodeIds: string[];
  circuitField: CircuitFieldState;
}

export const defaultCircuitEditorState: CircuitEditorState = {
  mouseOverNodeId: null,
  selectedNodeIds: [],
  circuitField: defaultCircuitFieldState
};
