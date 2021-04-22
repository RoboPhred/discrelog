import { SagaIterator } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";
import fileDialog from "file-dialog";

import history from "@/history";

import { ACTION_PROJECT_LOAD } from "@/actions/project-load";
import { receiveProject } from "@/actions/project-receive";

import { SaveData } from "@/services/savedata/types";

export default function* projectLoadSaga() {
  yield takeEvery(ACTION_PROJECT_LOAD, loadProject);
}

function* loadProject(): SagaIterator {
  try {
    const [file]: File[] = yield call(fileDialog, {
      accept: "application/json",
    });
    const contents = yield call(file.text.bind(file));
    const saveData: SaveData = JSON.parse(contents);
    let fileName = file.name;
    if (fileName) {
      fileName = fileName.substr(0, fileName.lastIndexOf(".json"));
    } else {
      fileName = "Unnamed Project";
    }
    yield put(receiveProject(fileName, saveData));

    history.push("/editor");
  } catch (e) {
    // TODO: Handle error
    console.warn("Failed to load project:", e);
  }
}
