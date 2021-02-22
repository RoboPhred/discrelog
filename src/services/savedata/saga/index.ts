import { fork } from "redux-saga/effects";

import projectExportLink from "./project-export-link";
import projectImportLink from "./project-import-link";
import projectLoadSaga from "./project-load";
import projectSaveSaga from "./project-save";

export default function* saveDataSaga() {
  yield fork(projectExportLink);
  yield fork(projectImportLink);
  yield fork(projectLoadSaga);
  yield fork(projectSaveSaga);
}
