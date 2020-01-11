import { takeLeading, select, put, delay } from "redux-saga/effects";

import { ACTION_SIM_START } from "@/actions/sim-start";
import { tickSim } from "@/actions/sim-tick";

import { isRunningSelector, ticksPerSecondSelector } from "../selectors/run";

export default function* runModeSaga() {
  yield takeLeading(ACTION_SIM_START, handleRunSim);
}

function* handleRunSim() {
  while (true) {
    const isRunning = yield select(isRunningSelector);
    if (!isRunning) {
      break;
    }

    yield put(tickSim(1));

    const tps = yield select(ticksPerSecondSelector);
    const timeToWait = Math.max(Math.ceil(1000 / tps), 1);
    yield delay(timeToWait);
  }
}
