import {
  CircuitFieldState,
  defaultCircuitFieldState,
} from "./components/CircuitFieldView/components/CircuitField/state";

export interface CircuitEditorState {
  circuitField: CircuitFieldState;
}

export const defaultCircuitEditorState: CircuitEditorState = {
  circuitField: defaultCircuitFieldState,
};
