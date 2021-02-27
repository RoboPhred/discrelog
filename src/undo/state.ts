import { AppServicesState } from "@/services/state";

export const UndoServicesStateKeys = [
  // Include view to jump us back to the circuit the operation took place on.
  "circuitEditorUiViewport",
  "circuits",
  "nodeGraph",
  "nodeLayout",
] as const;
export type UndoServicesStates = Pick<
  AppServicesState,
  "circuitEditorUiViewport" | "circuits" | "nodeGraph" | "nodeLayout"
>;

export interface UndoState {
  undoStack: UndoServicesStates[];
  redoStack: UndoServicesStates[];
}

const _defaultState: UndoState = {
  undoStack: [],
  redoStack: [],
};

export const defaultUndoState = Object.freeze(_defaultState);
