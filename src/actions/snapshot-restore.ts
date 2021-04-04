import { AnyAction } from "redux";

export const ACTION_SNAPSHOT_RESTORE = "@snapshot/restore" as const;
export const restoreSnapshot = (snapshotId: string) => ({
  type: ACTION_SNAPSHOT_RESTORE,
  payload: { snapshotId },
});
export type SnapshotRestoreAction = ReturnType<typeof restoreSnapshot>;
export function isSnapshotRestoreAction(
  action: AnyAction
): action is SnapshotRestoreAction {
  return action.type === ACTION_SNAPSHOT_RESTORE;
}
