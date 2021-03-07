import { fork } from "redux-saga/effects";

import projectSaga from "./project/saga";
import simulatorControlSaga from "./simulator-control/saga";

export default function* appSaga() {
  yield fork(projectSaga);
  yield fork(simulatorControlSaga);
}
