import { AnyAction } from "redux";

import { fpSet } from "@/utils";
import { AppState, defaultAppState } from "@/store";

import { isTutorialStartAction } from "@/actions/tutorial-start";

export default (state: AppState = defaultAppState, action: AnyAction) => {
  if (!isTutorialStartAction(action)) {
    return state;
  }

  const { tutorial } = action.payload;

  const preTutorialState = state;
  state = defaultAppState;

  state = fpSet(state, "services", "tutorial", {
    activeTutorial: tutorial,
    annotatedElements: [],
    preTutorialState,
  });

  return state;
};
