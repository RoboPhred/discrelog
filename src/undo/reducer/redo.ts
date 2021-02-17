import { AnyAction } from "redux";
import last from "lodash/last";
import pick from "lodash/pick";

import { AppState, defaultAppState } from "@/store";

import { isRedoAction } from "@/actions/redo";

import { UndoServicesStateKeys } from "../state";

export default function redoReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isRedoAction(action)) {
    return state;
  }

  const { undoStack, redoStack } = state.undo;

  const snapshot = last(redoStack);
  if (!snapshot) {
    return state;
  }

  return {
    ...state,
    services: {
      ...state.services,
      ...snapshot,
    },
    undo: {
      ...state.undo,
      undoStack: [...undoStack, pick(state.services, UndoServicesStateKeys)],
      redoStack: redoStack.slice(0, redoStack.length - 1),
    },
  };
}
