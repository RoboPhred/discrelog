import { AppState } from "@/store";

export const circuitFieldState = (state: AppState) =>
  state.ui.circuitEditor.circuitField;
