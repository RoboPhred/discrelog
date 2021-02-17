import { AppState } from "@/store";

export const canUndoSelector = (state: AppState) =>
  state.undo.undoStack.length > 0;
export const canRedoSelector = (state: AppState) =>
  state.undo.redoStack.length > 0;
