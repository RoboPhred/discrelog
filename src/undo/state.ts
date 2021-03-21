import { AppServicesState } from "@/services/state";

export const UndoServicesStateKeys = [
  "circuits",
  "elementGraph",
  "elementLayout",
] as const;
export type UndoServicesStates = Pick<
  AppServicesState,
  "circuits" | "elementGraph" | "elementLayout"
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
