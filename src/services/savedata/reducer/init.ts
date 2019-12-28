import { AnyAction } from "redux";
import { AppState, defaultAppState } from "@/store";

import { isInitAction } from "@/actions/init";

import { loadAutosave, loadSave } from "../utils";

export default function initReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isInitAction(action)) {
    return state;
  }

  const save = loadAutosave();
  if (!save) {
    return state;
  }

  return loadSave(state, save);
}
