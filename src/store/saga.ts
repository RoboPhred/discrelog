import { fork } from "redux-saga/effects";

import simulatorSaga from "@/services/simulator/saga";

export default function* appSaga() {
  yield fork(simulatorSaga);
}
