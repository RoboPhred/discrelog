import { fork } from "@redux-saga/core/effects";

import projectMutateSaga from "./project-mutate";
import projectResetSaga from "./project-reset";

export default function* autosaveSaga() {
  yield fork(projectMutateSaga);
  yield fork(projectResetSaga);
}
