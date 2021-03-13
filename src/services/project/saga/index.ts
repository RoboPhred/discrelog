import { fork } from "redux-saga/effects";

import projectExportLink from "./project-export-link";
import projectImportCircuits from "./project-import-circuits";
import projectImportLink from "./project-import-link";
import projectLoadSaga from "./project-load";
import projectSaveSaga from "./project-save";

export default function* saveDataSaga() {
  yield fork(projectExportLink);
  yield fork(projectImportCircuits);
  yield fork(projectImportLink);
  yield fork(projectLoadSaga);
  yield fork(projectSaveSaga);
}
