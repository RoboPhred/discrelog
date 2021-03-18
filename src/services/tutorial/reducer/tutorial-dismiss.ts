import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";

import { isTutorialDismissAction } from "@/actions/tutorial-dismiss";

export default (state: AppState = defaultAppState, action: AnyAction) => {
  if (!isTutorialDismissAction(action)) {
    return state;
  }

  return state.services.tutorial.preTutorialState ?? defaultAppState;
};
