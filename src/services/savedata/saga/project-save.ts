import { call, select, takeEvery } from "redux-saga/effects";
import { saveAs } from "file-saver";

import { AppState } from "@/store";

import { ACTION_PROJECT_SAVE } from "@/actions/project-save";

import { displayDialogSaga } from "@/services/dialog/api";

import { createSave } from "../utils";

export default function* projectSaveSaga() {
  yield takeEvery(ACTION_PROJECT_SAVE, saveProject);
}

function* saveProject() {
  const state: AppState = yield select();

  const fileName: string | null = yield call(
    displayDialogSaga,
    "save-project",
    null
  );
  if (!fileName) {
    return;
  }

  try {
    const save = createSave(state);
    const blob = new Blob([JSON.stringify(save, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    saveAs(blob, fileName);
  } catch (e) {
    // TODO: Handle error
    console.warn("Failed to save project:", e);
  }
}
