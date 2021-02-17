import { AppServicesState } from "@/services";

export const UndoServicesStateKeys = [
  "circuits",
  "nodeGraph",
  "nodeLayout",
] as const;
export type UndoServicesStates = Pick<
  AppServicesState,
  "circuits" | "nodeGraph" | "nodeLayout"
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
