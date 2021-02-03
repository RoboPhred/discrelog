import { ACTION_CIRCUIT_CREATE } from "@/actions/circuit-create";
import { newCircuit } from "@/actions/circuit-new";
import { displayDialogSaga } from "@/services/dialog/api";
import { call, put, takeEvery } from "redux-saga/effects";

export default function* circuitCreateSaga() {
  yield takeEvery(ACTION_CIRCUIT_CREATE, handleCircuitCreate);
}

function* handleCircuitCreate() {
  const circuitName: string | null = yield call(
    displayDialogSaga,
    "create-circuit"
  );

  if (!circuitName) {
    return;
  }

  yield put(newCircuit({ circuitName, edit: true }));
}
