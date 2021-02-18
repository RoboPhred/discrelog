import { AppServicesState, defaultServicesState } from "@/services/state";
import { defaultUndoState, UndoState } from "@/undo/state";

export interface AppState {
  services: AppServicesState;
  undo: UndoState;
}

const _defaultAppState: AppState = {
  services: defaultServicesState,
  undo: defaultUndoState,
};

export const defaultAppState = Object.freeze(_defaultAppState);
