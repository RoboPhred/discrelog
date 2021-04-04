import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import { fpSet } from "@/utils";

import { isSnapshotRestoreAction } from "@/actions/snapshot-restore";

export default function snapshotRestoreReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isSnapshotRestoreAction(action)) {
    return state;
  }

  const { snapshotId } = action.payload;

  const { snapshotsById } = state.services.snapshots;

  const snapshot = snapshotsById[snapshotId];
  if (!snapshot) {
    return state;
  }

  state = fpSet(state, "services", (servicesState) => ({
    ...servicesState,
    ...snapshot.services,
  }));

  return state;
}
