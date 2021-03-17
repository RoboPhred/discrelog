import { SagaIterator } from "redux-saga";
import { put, take } from "redux-saga/effects";

import { DialogData, DialogResult, DialogType } from "@/dialogs/types";

import { showDialog } from "@/actions/dialog-show";

import {
  AcceptDialogAction,
  ACTION_DIALOG_RESPONSE_ACCEPT,
} from "@/actions/dialog-response-accept";
import {
  CancelDialogAction,
  ACTION_DIALOG_RESPONSE_CANCEL,
} from "@/actions/dialog-response-cancel";

export function* displayDialogSaga<T extends DialogType>(
  dialogType: T,
  data: DialogData<T>
): SagaIterator<DialogResult<T> | null> {
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
