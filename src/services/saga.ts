import { fork } from "redux-saga/effects";

import saveDataSaga from "./savedata/saga";
import simulatorControlSaga from "./simulator-control/saga";

export default function* appSaga() {
  yield fork(saveDataSaga);
  yield fork(simulatorControlSaga);
}
