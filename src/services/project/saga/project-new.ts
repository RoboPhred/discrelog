import { ACTION_PROJECT_NEW } from "@/actions/project-new";
import { takeEvery } from "@redux-saga/core/effects";

import history from "@/history";

export default function* projectNewSaga() {
  yield takeEvery(ACTION_PROJECT_NEW, handleNewProject);
}

function* handleNewProject() {
  history.push("/editor");
}
