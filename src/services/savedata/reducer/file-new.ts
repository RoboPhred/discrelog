import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import { isNewFileAction } from "@/actions/file-new";

import { deleteAutosave } from "../utils";

export default function fileNewReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isNewFileAction(action)) {
    return state;
  }

  deleteAutosave();
  return state;
}
