import { put, takeEvery } from "redux-saga/effects";
import { Buffer } from "buffer";

import { inflate } from "pako";

import {
  ACTION_PROJECT_IMPORT_LINK,
  ImportProjectLinkAction,
} from "@/actions/project-import-link";

import { receiveProject } from "@/actions/project-receive";
import history from "@/history";

export default function* projectImportLinkSaga() {
  yield takeEvery(ACTION_PROJECT_IMPORT_LINK, onImportLink);
}

function* onImportLink(action: ImportProjectLinkAction) {
  const { data } = action.payload;
  try {
    const dewrapped = decodeURIComponent(data);
    const deflated = Buffer.from(dewrapped, "base64");
    const saveText = inflate(deflated, { to: "string" });
    const save = JSON.parse(saveText);

    yield put(receiveProject("Linked Project", save));

    history.replace("/");
  } catch (e) {
    console.error("Failed to import save from link", e);
  }
}
