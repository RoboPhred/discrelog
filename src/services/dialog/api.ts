import { SagaIterator } from "redux-saga";
import { put, take } from "redux-saga/effects";

import { showDialog } from "@/actions/dialog-show";

import { DialogType } from "./state";
import {
  AcceptDialogAction,
  ACTION_DIALOG_RESPONSE_ACCEPT,
} from "@/actions/dialog-response-accept";
import {
  CancelDialogAction,
  ACTION_DIALOG_RESPONSE_CANCEL,
} from "@/actions/dialog-response-cancel";

export function* displayDialogSaga(
  dialogType: DialogType,
  data: any
): SagaIterator<any> {
  yield put(showDialog(dialogType, data));
  const response: AcceptDialogAction | CancelDialogAction = yield take([
    ACTION_DIALOG_RESPONSE_ACCEPT,
    ACTION_DIALOG_RESPONSE_CANCEL,
  ]);

  if (response.type === ACTION_DIALOG_RESPONSE_ACCEPT) {
    return response.payload.result;
  }

  return null;
}
