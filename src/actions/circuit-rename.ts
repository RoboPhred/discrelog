import { AnyAction } from "redux";

export const ACTION_CIRCUIT_RENAME = "@circuit/rename" as const;
export const renameCircuit = (circuitId: string, circuitName: string) => ({
  type: ACTION_CIRCUIT_RENAME,
  payload: { circuitId, circuitName },
});
export type RenameCircuitAction = ReturnType<typeof renameCircuit>;
export function isRenameCircuitAction(
  action: AnyAction
): action is RenameCircuitAction {
  return action.type === ACTION_CIRCUIT_RENAME;
}
