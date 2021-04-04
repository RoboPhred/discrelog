import { AnyAction } from "redux";
import pick from "lodash/pick";

import { AppState, defaultAppState } from "@/store";

import { fpSet } from "@/utils";

import { isSnapshotPeekAction } from "@/actions/snapshot-peek";

import { SnapshotStateKeys } from "../state";

export default function snapshotPeekReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isSnapshotPeekAction(action)) {
    return state;
  }

  const { snapshotId } = action.payload;

  const peekSnapshot = state.services.snapshots.snapshotsById[snapshotId];
  if (!peekSnapshot) {
    return state;
  }

  state = fpSet(state, "services", "snapshots", (snapshotsState) => ({
    ...snapshotsState,
    peekSnapshotId: snapshotId,
    headSnapshot: pick(state.services, SnapshotStateKeys),
  }));

  state = fpSet(state, "services", (servicesState) => ({
    ...servicesState,
    ...peekSnapshot.services,
  }));

  return state;
}
