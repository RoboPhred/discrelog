import { AnyAction } from "redux";
import { AppState, defaultAppState } from "@/store";

import { isInitAction } from "@/actions/init";

import { loadAutosave, loadSave } from "@/services/savedata/api";
import { fpSet } from "@/utils";

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

  try {
    state = loadSave(state, save);
    state = fpSet(state, "services", "project", (state) => ({
      ...state,
      projectName: "Previous Project",
      projectModified: true,
    }));
  } catch {
    // TODO: Reprot error
  }

  return state;
}
