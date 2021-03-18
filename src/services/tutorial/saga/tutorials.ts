import { call, takeEvery } from "redux-saga/effects";

import {
  ACTION_TUTORIAL_START,
  TutorialStartAction,
} from "@/actions/tutorial-start";

import runBasicsTutorial from "./tutorials/basic";
import runCircuitsTutorial from "./tutorials/circuits";

export default function* startTutorial() {
  yield takeEvery(ACTION_TUTORIAL_START, handleStartTutorial);
}

function* handleStartTutorial(action: TutorialStartAction) {
  const { tutorial } = action.payload;
  switch (tutorial) {
    case "basics":
      yield call(runBasicsTutorial);
      return;
    case "circuits":
      yield call(runCircuitsTutorial);
  }
}
