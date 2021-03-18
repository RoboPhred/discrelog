import { AnyAction } from "redux";

import { fpSet } from "@/utils";
import { AppState, defaultAppState } from "@/store";

import { isTutorialStartAction } from "@/actions/tutorial-start";

export default (state: AppState = defaultAppState, action: AnyAction) => {
  if (!isTutorialStartAction(action)) {
    return state;
  }

  const { tutorial } = action.payload;

  let { preTutorialState } = state.services.tutorial;
  if (!preTutorialState) {
    preTutorialState = state;
  }

  state = defaultAppState;

  state = fpSet(state, "services", "project", "projectName", "Tutorial");

  state = fpSet(state, "services", "tutorial", {
    activeTutorial: tutorial,
    annotatedElements: [],
    preTutorialState,
  });

  return state;
};
