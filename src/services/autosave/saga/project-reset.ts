import { takeEvery } from "@redux-saga/core/effects";

import { ACTION_PROJECT_NEW } from "@/actions/project-new";

import { deleteAutosave } from "../api";

export default function* projectResetSaga() {
  yield takeEvery(ACTION_PROJECT_NEW, handleProjectNewAction);
}

function* handleProjectNewAction() {
  deleteAutosave();
}
