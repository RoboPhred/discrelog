import { AnyAction } from "redux";
import last from "lodash/last";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isUndoAction } from "@/actions/undo";
import { viewCircuit } from "@/actions/view-circuit";

import { captureUndoState } from "../utils";

export default function undoReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isUndoAction(action)) {
    return state;
  }

  const { undoStack, redoStack } = state.undo;

  const stackItem = last(undoStack);
  if (!stackItem) {
    return state;
  }

  const { serviceStates, viewCircuitId } = stackItem;

  state = {
    ...state,
    services: {
      ...state.services,
      ...serviceStates,
    },
    undo: {
      ...state.undo,
      undoStack: undoStack.slice(0, undoStack.length - 1),
      redoStack: [...redoStack, captureUndoState(state)],
    },
  };

  if (viewCircuitId) {
    state = rootReducer(state, viewCircuit(viewCircuitId));
  }

  return state;
}
