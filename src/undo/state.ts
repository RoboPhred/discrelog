import { AppServicesState } from "@/services/state";

export const UndoServicesStateKeys = [
  "circuitProperties",
  "circuitGraph",
  "circuitLayout",
] as const;
export type UndoServicesStates = Pick<
  AppServicesState,
  "circuitProperties" | "circuitGraph" | "circuitLayout"
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
