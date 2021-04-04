import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import { PRIORITY_PRE, reducerPriority } from "@/store/priorities";

import { fpSet } from "@/utils";

import { isStartSimAction } from "@/actions/sim-start";
import { isStepSimAction } from "@/actions/sim-step";
import { isTickSimAction } from "@/actions/sim-tick";

// Run before the simulator to restore the 'current' state.
export default reducerPriority(
  PRIORITY_PRE,
  (state: AppState = defaultAppState, action: AnyAction) => {
    if (
      !isStepSimAction(action) &&
      !isTickSimAction(action) &&
      !isStartSimAction(action)
    ) {
      return state;
    }

    if (!state.services.simulator.initialized) {
      return state;
    }

    const { head } = state.services.snapshots;
    if (!head) {
      return state;
    }

    state = fpSet(state, "services", (servicesState) => ({
      ...servicesState,
      ...head,
    }));

    state = fpSet(state, "services", "snapshots", (snapshotsState) => ({
      ...snapshotsState,
      peekSnapshotId: null,
      headSnapshot: null,
    }));

    return state;
  }
);
