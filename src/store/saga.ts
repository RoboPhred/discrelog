import { fork } from "redux-saga/effects";

import saveDataSaga from "@/services/savedata/saga";
import simulatorSaga from "@/services/simulator/saga";

export default function* appSaga() {
  yield fork(saveDataSaga);
  yield fork(simulatorSaga);
}
