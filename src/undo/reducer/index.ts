import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";

import captureUndoStateReducer from "./capture-undo-state";
import redoReducer from "./redo";
import undoReducer from "./undo";

// The undo reducer is special and returns a single reducer that is always ran outside of the primary reducer stack.
// This is less for reducer priority and more to capture the effects of reentrant reducers like clipboard-paste.
// FIXME: Moving this outside the services system means autosave cannot save undo/redo.  Either move autosave out
//  as well or move undo into services.
export default function undoServiceReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  state = captureUndoStateReducer(state, action);
  state = redoReducer(state, action);
  state = undoReducer(state, action);
  return state;
}
