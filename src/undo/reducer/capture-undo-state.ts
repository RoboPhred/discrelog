import { AnyAction } from "redux";

import { isProjectMutationAction } from "@/project-mutation-actions";
import { AppState, defaultAppState } from "@/store";
import { fpSet } from "@/utils";

import { isUndoAction } from "@/actions/undo";
import { isRedoAction } from "@/actions/redo";

import { captureUndoState } from "../utils";

// If this was part of the normal reducer stack, we would want to give it a very low priority
// so it occurs after all other reducers.
// However, in order to capture reentrant reducers, our master undo reducer wraps
// the root reducer especially and always occurs last.
export default function captureUndoStateReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (
    !isProjectMutationAction(action) ||
    isUndoAction(action) ||
    isRedoAction(action)
  ) {
    return state;
  }

  return fpSet(state, "undo", (undoState) => ({
    ...undoState,
    // Limiting undo to 25 entries, since we store the entire project every slice.
    // TODO: Consider using a difference engine to store the minimal difference between the states.
    //  This should let us store far more undo operations as the project gets larger.
    // Could use https://www.npmjs.com/package/deep-diff
    // Problem with this is it takes up time capturing the undo, which slows down all operations.
    undoStack: [...undoState.undoStack.slice(0, 24), captureUndoState(state)],
    redoStack: [],
  }));
}
