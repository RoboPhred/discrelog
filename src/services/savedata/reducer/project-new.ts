import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";

import { isNewProjectAction } from "@/actions/project-new";

import { deleteAutosave } from "../utils";

export default function fileNewReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isNewProjectAction(action)) {
    return state;
  }

  deleteAutosave();
  return state;
}
