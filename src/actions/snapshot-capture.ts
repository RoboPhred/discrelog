import { v4 as uuidV4 } from "uuid";
import { AnyAction } from "redux";

export const ACTION_SNAPSHOT_CAPTURE = "@snapshot/capture" as const;
export const captureSnapshot = () => ({
  type: ACTION_SNAPSHOT_CAPTURE,
  payload: { snapshotId: uuidV4() },
});
export type SnapshotCaptureAction = ReturnType<typeof captureSnapshot>;
export function isSnapshotCaptureAction(
  action: AnyAction
): action is SnapshotCaptureAction {
  return action.type === ACTION_SNAPSHOT_CAPTURE;
}
