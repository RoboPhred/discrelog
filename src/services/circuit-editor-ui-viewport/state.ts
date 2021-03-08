export interface CircuitEditorUiViewportServiceState {
  /**
   * The scaling for rendering the circuit in the UI.
   */
  viewScale: number;
}

const _defaultState: CircuitEditorUiViewportServiceState = {
  viewScale: 1,
};

export const defaultCircuitEditorUiViewportServiceState = Object.freeze(
  _defaultState
);
