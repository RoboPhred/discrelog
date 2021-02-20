import { SagaIterator } from "redux-saga";
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

  try {
    if (window.showSaveFilePicker) {
      yield call(saveNativeFileApi, state);
    } else {
      yield call(saveLegacy, state);
    }
  } catch (e) {
    // TODO: Report error
    console.warn("Failed to save project", e);
  }
}

function* saveNativeFileApi(state: AppState) {
  const fileHandle: FileHandle | null = yield call(window.showSaveFilePicker!, {
    types: [
      {
        description: "Discrelog Project Files",
        accept: {
          "application/json": [".json"],
        },
      },
    ],
  });

  if (!fileHandle) {
    return;
  }

  const save = createSave(state);

  const writable: FileSystemWritableStream = yield call(
    fileHandle.createWritable.bind(fileHandle)
  );
  yield call(writable.write.bind(writable), JSON.stringify(save, null, 2));
  yield call(writable.close.bind(writable));
}

function* saveLegacy(state: AppState) {
  const save = createSave(state);
  const blob = new Blob([JSON.stringify(save, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  // TODO: Show dialog to get desired name.
  saveAs(blob, "discrelog-project.json");
}
