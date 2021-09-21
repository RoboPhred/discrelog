import { put, takeEvery } from "@redux-saga/core/effects";

import history from "@/history";

import { loadAutosave } from "@/services/autosave/api";

import { receiveProject } from "@/actions/project-receive";
import { ACTION_PROJECT_RESTORE_PREVIOUS } from "@/actions/project-restore-previous";

export default function* projectRestorePreviousSaga() {
  yield takeEvery(
    ACTION_PROJECT_RESTORE_PREVIOUS,
    handleProjectRestorePrevious
  );
}

function* handleProjectRestorePrevious() {
  const previous = loadAutosave();
  if (!previous) {
    return;
  }

  yield put(receiveProject("Previous Project", previous));

  history.push("/editor");
}
