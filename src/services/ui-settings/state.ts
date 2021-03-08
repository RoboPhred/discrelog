export interface UiSettingsState {
  nodeNameMode: "all" | "named-only" | "none";
}

const _defaultState: UiSettingsState = {
  nodeNameMode: "named-only",
};

export const defaultUiSettingsState = Object.freeze(_defaultState);
