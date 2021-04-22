import { takeEvery } from "@redux-saga/core/effects";

import { PROJECT_RESET_ACTIONS } from "@/project-mutation-actions";

import { deleteAutosave } from "../api";

export default function* projectResetSaga() {
  yield takeEvery(PROJECT_RESET_ACTIONS, handleProjectNewAction);
}

function* handleProjectNewAction() {
  deleteAutosave();
}
