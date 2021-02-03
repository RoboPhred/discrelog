import { fork } from "redux-saga/effects";

import circuitCreateSaga from "./circuit-create";

export default function* circuitsSaga() {
  yield fork(circuitCreateSaga);
}
