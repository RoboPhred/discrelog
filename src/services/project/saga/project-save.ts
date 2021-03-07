import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { saveAs } from "file-saver";

import { AppState } from "@/store";

import { ACTION_PROJECT_SAVE } from "@/actions/project-save";
import { renameProject } from "@/actions/project-rename";

import { createSave } from "@/services/savedata/api";

import { projectNameSelector } from "../selectors/project";

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

function* saveNativeFileApi(state: AppState): SagaIterator {
  const projectName = yield select(projectNameSelector);

  const fileHandle: FileHandle | null = yield call(window.showSaveFilePicker!, {
    // This isn't official yet, even with the not-official showSaveFilePicker
    // https://github.com/WICG/file-system-access/blob/main/SuggestedNameAndDir.md#specifying-suggested-file-name-to-save-as
    // It's so new, chrome does not yet support it, but it will:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1145102
    suggestedName: projectName,
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

  // Some confusion over how to get the name of the file...
  // fileHandle.name appears in the debugger for chrome, but does not
  // seem to be documented.
  // getFile().name is documented by mozilla, but gives me undefined.
  let name = fileHandle.name;
  if (!name) {
    name = fileHandle.getFile().name;
  }
  if (name) {
    yield put(renameProject(name));
  }

  const save = createSave(state);

  const writable: FileSystemWritableStream = yield call(
    fileHandle.createWritable.bind(fileHandle)
  );
  yield call(writable.write.bind(writable), JSON.stringify(save, null, 2));
  yield call(writable.close.bind(writable));
}

function* saveLegacy(state: AppState): SagaIterator {
  const projectName = yield select(projectNameSelector);

  const save = createSave(state);
  const blob = new Blob([JSON.stringify(save, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  saveAs(blob, `${projectName}.json`);
}
