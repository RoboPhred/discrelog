import { AnyAction } from "redux";
import last from "lodash/last";

import { AppState, defaultAppState } from "@/store";

import { isRedoAction } from "@/actions/redo";

import { captureUndoState } from "../utils";

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
      undoStack: [...undoStack, captureUndoState(state)],
      redoStack: redoStack.slice(0, redoStack.length - 1),
    },
  };
}
