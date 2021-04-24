import { eventChannel, SagaIterator, buffers } from "redux-saga";
import { takeLeading, select, put, take, call } from "redux-saga/effects";

import { ACTION_SIM_START } from "@/actions/sim-start";
import { ACTION_SIM_PAUSE, pauseSim } from "@/actions/sim-pause";
import { ACTION_SIM_STEP } from "@/actions/sim-step";

import { tickSim } from "@/actions/sim-tick";

import { isSimRunningSelector, ticksPerSecondSelector } from "../selectors/run";

export default function* runModeSaga() {
  yield takeLeading(
    [ACTION_SIM_START, ACTION_SIM_PAUSE, ACTION_SIM_STEP],
    handleRunSim
  );
}

function* handleRunSim(): SagaIterator {
  runSimLoop: while (true) {
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

    const shouldContinue = yield call(waitNextTick);
    if (!shouldContinue) {
      break;
    }
  }
}

function* waitNextTick(): SagaIterator<boolean> {
  const tps = yield select(ticksPerSecondSelector);
  const timeToWait = Math.max(Math.ceil(1000 / tps), 1);
  const endWait = performance.now() + timeToWait;
  while (true) {
    const timestamp = yield take(animationFrameChannel);
    const isRunning = yield select(isSimRunningSelector);
    if (!isRunning) {
      return false;
    }

    if (endWait <= timestamp) {
      return true;
    }
  }
}

// We cannot use redux-saga delay here, as it uses setInterval.
// On firefox, setInterval has been broken for going on 2 years now:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1566900
// Like most bugs submitted to open source projects, it's been marked WontFix.
// See test here: http://mozilla.pettay.fi/moztests/setInterval16.html
// TODO: Clean this up.  This fires channel events like mad.
// Ideally, this would know how long to wait and only emit events when the time is hit.
const animationFrameChannel = eventChannel((listener) => {
  let active = true;

  function awaitAnimationFrame() {
    if (!active) {
      return;
    }

    requestAnimationFrame((timestamp) => {
      if (!active) {
        return;
      }
      listener(timestamp);
      awaitAnimationFrame();
    });
  }

  awaitAnimationFrame();
  return () => {
    active = false;
  };
}, buffers.sliding(1));
