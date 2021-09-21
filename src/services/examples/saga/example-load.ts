import { put, takeEvery } from "@redux-saga/core/effects";

import history from "@/history";

import { ACTION_EXAMPLE_LOAD, LoadExampleAction } from "@/actions/example-load";

import { SaveData } from "@/services/savedata/types";
import { receiveProject } from "@/actions/project-receive";

import examples from "../examples";

export default function* exampleLoadSaga() {
  yield takeEvery(ACTION_EXAMPLE_LOAD, exampleLoad);
}

function* exampleLoad(action: LoadExampleAction) {
  const { exampleKey } = action.payload;

  const example = examples[exampleKey];
  if (!example) {
    return;
  }

  const saveData: SaveData = yield example.getSave();

  yield put(receiveProject(example.title, saveData));
  history.push("/editor");
}
