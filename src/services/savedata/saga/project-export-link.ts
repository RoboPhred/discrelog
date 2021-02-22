import { call, select, takeEvery } from "redux-saga/effects";
import { Buffer } from "buffer";

import { deflate } from "pako";

import { rootUrl } from "@/runtime-env";
import { AppState } from "@/store";

import { ACTION_PROJECT_EXPORT_LINK } from "@/actions/project-export-link";

import { createSave } from "../utils";

export default function* projectExportLinkSaga() {
  yield takeEvery(ACTION_PROJECT_EXPORT_LINK, onExportLink);
}

function* onExportLink() {
  const state: AppState = yield select();

  try {
    const save = createSave(state);
    const saveText = JSON.stringify(save);
    const encoded = deflate(saveText);

    const encodedText = Buffer.from(encoded).toString("base64");

    const urlData = encodeURIComponent(encodedText);

    // Would be nice if we could get the react-router context to generate this, but that is buried in the react stack.
    const link = `${rootUrl}#/import?data=${urlData}`;

    // TODO: Show link in dialog on failure
    yield call(navigator.clipboard.writeText.bind(navigator.clipboard), link);

    // TODO: Show toast indicating link was copied to clipboard.
    alert("Project link copied to clipboard");
  } catch (e) {
    // TODO: Warn user of failure
    console.error("Failed to export project as link", e);
  }
}
