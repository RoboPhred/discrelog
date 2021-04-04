import { AppServicesState } from "../state";

export const SnapshotStateKeys = ["simulator"] as const;
export type SnapshotServices = Pick<AppServicesState, "simulator">;

export interface Snapshot {
  name: string;
  services: SnapshotServices;
}

export interface SnapshotsServiceState {
  /**
   * All snapshots keyed by snapshot id.
   */
  snapshotsById: Record<string, Snapshot>;

  /**
   * All snapshot ids in ascending order of tick.
   */
  snapshotIds: string[];

  /**
   * The ID of the snapshot we are peeking at.
   */
  peekSnapshotId: string | null;

  /**
   * The current state of the simulator, archived for a peek.
   */
  head: SnapshotServices | null;
}

const _defaultState: SnapshotsServiceState = {
  snapshotsById: {},
  snapshotIds: [],
  peekSnapshotId: null,
  head: null,
};

export const defaultSnapshotsServiceState = Object.freeze(_defaultState);
