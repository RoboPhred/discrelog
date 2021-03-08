import { SagaIterator } from "redux-saga";
import { takeLeading, select, put, delay } from "redux-saga/effects";

import { ACTION_SIM_START } from "@/actions/sim-start";
import { ACTION_SIM_PAUSE, pauseSim } from "@/actions/sim-pause";

import { tickSim } from "@/actions/sim-tick";

import { isSimRunningSelector, ticksPerSecondSelector } from "../selectors/run";

export default function* runModeSaga() {
  yield takeLeading([ACTION_SIM_START, ACTION_SIM_PAUSE], handleRunSim);
}

function* handleRunSim(): SagaIterator {
  while (true) {
    const isRunning = yield select(isSimRunningSelector);
    if (!isRunning) {
      break;
    }

    try {
      yield put(tickSim(1));
    } catch (e) {
      console.error(e);
      yield put(pauseSim(true));
      return;
    }

    const tps = yield select(ticksPerSecondSelector);
    const timeToWait = Math.max(Math.ceil(1000 / tps), 1);
    yield delay(timeToWait);
  }
}
