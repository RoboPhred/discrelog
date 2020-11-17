import { call, put, takeEvery } from "redux-saga/effects";
import fileDialog from "file-dialog";

import { ACTION_PROJECT_LOAD } from "@/actions/project-load";
import { receiveProject } from "@/actions/project-receive";

import { SaveData } from "../types";

export default function* projectLoadSaga() {
  yield takeEvery(ACTION_PROJECT_LOAD, loadProject);
}

function* loadProject() {
  try {
    const [file]: File[] = yield call(fileDialog, {
      accept: "application/json",
    });
    const contents = yield call(file.text.bind(file));
    const saveData: SaveData = JSON.parse(contents);
    yield put(receiveProject(saveData));
  } catch (e) {
    // TODO: Handle error
    console.warn("Failed to load project:", e);
  }
}
