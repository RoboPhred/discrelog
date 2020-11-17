import { fork } from "redux-saga/effects";

import projectLoadSaga from "./project-load";
import projectSaveSaga from "./project-save";

export default function* saveDataSaga() {
  yield fork(projectLoadSaga);
  yield fork(projectSaveSaga);
}
