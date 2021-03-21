export interface UiSettingsState {
  elementNameMode: "all" | "named-only" | "none";
}

const _defaultState: UiSettingsState = {
  elementNameMode: "named-only",
};

export const defaultUiSettingsState = Object.freeze(_defaultState);
