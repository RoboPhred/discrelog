import { AppServicesState } from "@/services/state";

export const UndoServicesStateKeys = [
  "circuits",
  "circuitGraph",
  "circuitLayout",
] as const;
export type UndoServicesStates = Pick<
  AppServicesState,
  "circuits" | "circuitGraph" | "circuitLayout"
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
