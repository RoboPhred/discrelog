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
    state = fpSet(state, "services", "project", "projectLoadState", "loading");
    state = loadSave(state, saveData);
    state = fpSet(state, "services", "project", (state) => ({
      ...state,
      projectLoadState: "loaded" as const,
      projectName: fileName,
      projectModified: false,
    }));
  } catch (e) {
    // TODO: display error
    console.error("Failed to load save", e);
    state = fpSet(state, "services", "project", (state) => ({
      ...state,
      projectLoadState: "no-project" as const,
      projectName: "",
      projectModified: false,
    }));
  }

  return state;
}
