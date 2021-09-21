import { SnapshotsServiceState } from "../state";
import { createSnapshotsSelector } from "../utils";

export const snapshotIdsSelector = createSnapshotsSelector(
  (s) => s.snapshotIds
);

export const snapshotNameFromSnapshotIdSelector = createSnapshotsSelector(
  (s: SnapshotsServiceState, snapshotId: string) =>
    s.snapshotsById[snapshotId].name
);
