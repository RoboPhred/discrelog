import { fork } from "redux-saga/effects";

import pageNavigateEditorSaga from "./page-navigate-editor";
import projectExportLinkSaga from "./project-export-link";
import projectImportCircuitsSaga from "./project-import-circuits";
import projectImportLinkSaga from "./project-import-link";
import projectLoadSaga from "./project-load";
import projectNewSaga from "./project-new";
import projectRestorePreviousSaga from "./project-restore-previous";
import projectSaveSaga from "./project-save";

export default function* saveDataSaga() {
  yield fork(pageNavigateEditorSaga);
  yield fork(projectExportLinkSaga);
  yield fork(projectImportCircuitsSaga);
  yield fork(projectImportLinkSaga);
  yield fork(projectLoadSaga);
  yield fork(projectNewSaga);
  yield fork(projectRestorePreviousSaga);
  yield fork(projectSaveSaga);
}
