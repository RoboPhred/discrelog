import pick from "lodash/pick";

import { isSnapshotCaptureAction } from "@/actions/snapshot-capture";
import { SnapshotStateKeys } from "../state";
import { createSnapshotsReducer } from "../utils";

export default createSnapshotsReducer((state, action, rootState) => {
  if (!isSnapshotCaptureAction(action)) {
    return state;
  }

  if (!rootState.services.simulator.initialized) {
    return state;
  }

  if (state.peekSnapshotId) {
    return state;
  }

  const { snapshotId } = action.payload;

  return {
    ...state,
    snapshotsById: {
      ...state.snapshotsById,
      [snapshotId]: {
        name: `Snapshot ${state.snapshotIds.length + 1}`,
        services: pick(rootState.services, SnapshotStateKeys),
      },
    },
    snapshotIds: [...state.snapshotIds, snapshotId],
  };
});
