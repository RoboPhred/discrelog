import { AnyAction } from "redux";

export const ACTION_SNAPSHOT_PEEK = "@snapshot/peek" as const;
export const peekSnapshot = (snapshotId: string) => ({
  type: ACTION_SNAPSHOT_PEEK,
  payload: { snapshotId },
});
export type SnapshotPeekAction = ReturnType<typeof peekSnapshot>;
export function isSnapshotPeekAction(
  action: AnyAction
): action is SnapshotPeekAction {
  return action.type === ACTION_SNAPSHOT_PEEK;
}
