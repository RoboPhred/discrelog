import { AnyAction } from "redux";
import pick from "lodash/pick";

import { isProjectMutationAction } from "@/project-mutation-actions";
import { AppState, defaultAppState } from "@/store";
import { fpSet } from "@/utils";

import { isUndoAction } from "@/actions/undo";
import { isRedoAction } from "@/actions/redo";

import { UndoServicesStateKeys } from "../state";

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
    undoStack: [
      ...undoState.undoStack,
      pick(state.services, UndoServicesStateKeys),
    ],
    redoStack: [],
  }));
}
