import { fork } from "redux-saga/effects";

import autosaveSaga from "./autosave/saga";
import projectSaga from "./project/saga";
import simulatorControlSaga from "./simulator-control/saga";
import tutorialSaga from "./tutorial/saga";

export default function* appSaga() {
  yield fork(autosaveSaga);
  yield fork(projectSaga);
  yield fork(simulatorControlSaga);
  yield fork(tutorialSaga);
}
