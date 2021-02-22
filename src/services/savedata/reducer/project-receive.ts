import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";

import { isReceiveProjectAction } from "@/actions/project-receive";

import { loadSave } from "../utils";

export default function projectReceiveReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isReceiveProjectAction(action)) {
    return state;
  }

  try {
    return loadSave(state, action.payload.saveData);
  } catch (e) {
    // TODO: display error
    console.error("Failed to load save", e);
    return state;
  }
}
