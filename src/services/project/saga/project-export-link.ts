import { call, select, takeEvery } from "redux-saga/effects";
import { Buffer } from "buffer";
import { deflate } from "pako";

import { rootUrl } from "@/env";
import history from "@/history";

import { AppState } from "@/store";

import { displayDialogSaga } from "@/services/dialog/api";

import { ACTION_PROJECT_EXPORT_LINK } from "@/actions/project-export-link";

import { createSave } from "@/services/savedata/api";

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

    const projectLink =
      rootUrl +
      history.createHref({
        pathname: "/import",
        search: `data=${urlData}`,
      });

    yield call(displayDialogSaga, "export-project-link", { projectLink });
  } catch (e) {
    // TODO: Warn user of failure
    console.error("Failed to export project as link", e);
  }
}
