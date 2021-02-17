import { AnyAction } from "redux";
import last from "lodash/last";

import { captureUndoState } from "../utils";

import { AppState, defaultAppState } from "@/store";

import { isUndoAction } from "@/actions/undo";

export default function undoReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isUndoAction(action)) {
    return state;
  }

  const { undoStack, redoStack } = state.undo;

  const snapshot = last(undoStack);
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
      undoStack: undoStack.slice(0, undoStack.length - 1),
      redoStack: [...redoStack, captureUndoState(state)],
    },
  };
}
