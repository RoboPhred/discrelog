import { SagaIterator } from "redux-saga";
import { put, select, takeEvery } from "@redux-saga/core/effects";

import {
  ACTION_PAGE_NAVIGATE,
  PageNavigateAction,
} from "@/actions/page-navigate";
import { restorePreviousProject } from "@/actions/project-restore-previous";

import { projectLoadStateSelector } from "../selectors/project";
import { ProjectServiceState } from "../state";

export default function* pageNavigateEditorSaga() {
  yield takeEvery(ACTION_PAGE_NAVIGATE, onPageNavigate);
}

function* onPageNavigate(action: PageNavigateAction): SagaIterator {
  const { page } = action.payload;
  if (page !== "editor") {
    return;
  }

  const loadState: ProjectServiceState["projectLoadState"] = yield select(
    projectLoadStateSelector
  );
  if (loadState !== "no-project") {
    return;
  }

  yield put(restorePreviousProject());
}
