import { fork } from "redux-saga/effects";

import circuitsSaga from "@/services/circuits/saga";
import saveDataSaga from "@/services/savedata/saga";
import simulatorSaga from "@/services/simulator/saga";

export default function* appSaga() {
  yield fork(circuitsSaga);
  yield fork(saveDataSaga);
  yield fork(simulatorSaga);
}
