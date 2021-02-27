export interface CircuitEditorUiSettingsState {
  nodeNameMode: "all" | "named-only" | "none";
}

const _defaultState: CircuitEditorUiSettingsState = {
  nodeNameMode: "named-only",
};

export const defaultCircuitEditorUiSettingsState = Object.freeze(_defaultState);
