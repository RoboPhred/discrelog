import { AppServicesState } from "@/services/state";

export const UndoServicesStateKeys = [
  "circuits",
  "nodeGraph",
  "nodeLayout",
] as const;
export type UndoServicesStates = Pick<
  AppServicesState,
  "circuits" | "nodeGraph" | "nodeLayout"
>;

export interface UndoStackState {
  serviceStates: UndoServicesStates;
  viewCircuitId: string | null;
}

export interface UndoState {
  undoStack: UndoStackState[];
  redoStack: UndoStackState[];
}

const _defaultState: UndoState = {
  undoStack: [],
  redoStack: [],
};

export const defaultUndoState = Object.freeze(_defaultState);
