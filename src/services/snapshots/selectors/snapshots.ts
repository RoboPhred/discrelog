import { SnapshotsServiceState } from "../state";
import { createSnapshotsSelector } from "../utils";

export const snapshotIds = createSnapshotsSelector((s) => s.snapshotIds);

export const peekSnapshotId = createSnapshotsSelector((s) => s.peekSnapshotId);

export const snapshotNameFromSnapshotId = createSnapshotsSelector(
  (s: SnapshotsServiceState, snapshotId: string) =>
    s.snapshotsById[snapshotId].name
);
