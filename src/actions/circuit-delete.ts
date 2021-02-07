import { AnyAction } from "redux";

export const ACTION_CIRCUIT_DELETE = "@circuit/delete" as const;
export const deleteCircuit = (circuitId: string) => ({
  type: ACTION_CIRCUIT_DELETE,
  payload: { circuitId },
});
export type DeleteCircuitAction = ReturnType<typeof deleteCircuit>;
export function isDeleteCircuitAction(
  action: AnyAction
): action is DeleteCircuitAction {
  return action.type === ACTION_CIRCUIT_DELETE;
}
