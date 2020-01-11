import { fork } from "redux-saga/effects";

import runModeSaga from "./mode-run";

export default function* simulatorSaga() {
  yield fork(runModeSaga);
}
