import { AnyAction } from "redux";

export const ACTION_CIRCUIT_EDIT = "@circuit/edit" as const;
export const editCircuit = (circuitId: string) => ({
  type: ACTION_CIRCUIT_EDIT,
  payload: { circuitId },
});
export type EditCircuitAction = ReturnType<typeof editCircuit>;
export function isEditCircuitAction(
  action: AnyAction
): action is EditCircuitAction {
  return action.type === ACTION_CIRCUIT_EDIT;
}
