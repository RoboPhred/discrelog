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
}

const _defaultState: SnapshotsServiceState = {
  snapshotsById: {},
  snapshotIds: [],
};

export const defaultSnapshotsServiceState = Object.freeze(_defaultState);
