import { select, takeEvery } from "@redux-saga/core/effects";

import { AppState } from "@/store";

import { PROJECT_MUTATION_ACTIONS } from "@/project-mutation-actions";

import { createSave } from "@/services/savedata/api";
import { isTutorialActiveSelector } from "@/services/tutorial/selectors/tutorial";

import { storeAutosave } from "../api";

export default function* projectMutateSaga() {
  yield takeEvery(PROJECT_MUTATION_ACTIONS, handleProjectMutateAction);
}

function* handleProjectMutateAction() {
  const state: AppState = yield select();

  if (isTutorialActiveSelector(state)) {
    return;
  }

  try {
    const save = createSave(state);
    storeAutosave(save);
  } catch (e) {
    console.error("Failed to make autosave:", e);
  }
}
