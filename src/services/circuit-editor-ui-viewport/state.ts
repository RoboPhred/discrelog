import { ROOT_CIRCUIT_ID } from "../circuits/constants";

export interface CircuitEditorUiViewportServiceState {
  /**
   * The id of the circuit currently being edited.
   */
  editingCircuitId: string;

  /**
   * The path through specific nodes we took to view this circuit.
   * This enables rendering state for the circuit view.
   */
  editingCircuitNodeIdPath: string[] | null;

  /**
   * The scaling for rendering the circuit in the UI.
   */
  viewScale: number;
}

const _defaultState: CircuitEditorUiViewportServiceState = {
  editingCircuitId: ROOT_CIRCUIT_ID,
  editingCircuitNodeIdPath: null,
  viewScale: 1,
};

export const defaultCircuitEditorUiViewportServiceState = Object.freeze(
  _defaultState
);
