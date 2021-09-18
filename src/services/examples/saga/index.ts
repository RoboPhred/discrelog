import { fork } from "@redux-saga/core/effects";

import exampleLoadSaga from "./example-load";

export default function* examplesSaga() {
  yield fork(exampleLoadSaga);
}
