import { AnyAction } from "redux";
import last from "lodash/last";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isRedoAction } from "@/actions/redo";
import { viewCircuit } from "@/actions/view-circuit";

import { captureUndoState } from "../utils";

export default function redoReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isRedoAction(action)) {
    return state;
  }

  const { undoStack, redoStack } = state.undo;

  const stackItem = last(redoStack);
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
      undoStack: [...undoStack, captureUndoState(state)],
      redoStack: redoStack.slice(0, redoStack.length - 1),
    },
  };

  if (viewCircuitId) {
    state = rootReducer(state, viewCircuit(viewCircuitId));
  }

  return state;
}
