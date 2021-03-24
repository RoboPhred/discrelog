import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import { fpSet } from "@/utils";

import { isReceiveProjectAction } from "@/actions/project-receive";

import { loadSave } from "@/services/savedata/api";

export default function projectReceiveReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isReceiveProjectAction(action)) {
    return state;
  }

  const { fileName, saveData } = action.payload;

  try {
    state = fpSet(state, "services", "project", "isLoading", true);
    state = loadSave(state, saveData);
    state = fpSet(state, "services", "project", (state) => ({
      ...state,
      projectName: fileName,
      projectModified: false,
      isLoading: false,
    }));
  } catch (e) {
    // TODO: display error
    console.error("Failed to load save", e);
    state = fpSet(state, "services", "project", (state) => ({
      ...state,
      projectName: "",
      projectModified: false,
      isLoading: false,
    }));
  }

  return state;
}
