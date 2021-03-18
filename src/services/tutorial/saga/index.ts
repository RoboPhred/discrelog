import { fork } from "redux-saga/effects";

import tutorialsSaga from "./tutorials";

export default function* tutorialSaga() {
  yield fork(tutorialsSaga);
}
