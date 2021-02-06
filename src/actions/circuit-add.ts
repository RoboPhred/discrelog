import { AnyAction } from "redux";
import { v4 as uuidV4 } from "uuid";

export const ACTION_CIRCUIT_ADD = "@circuit/add" as const;
export interface NewCircuitOpts {
  circuitName?: string;
  circuitId?: string;
  edit?: boolean;
}
export const addCircuit = ({
  circuitName,
  circuitId,
  edit,
}: NewCircuitOpts = {}) => ({
  type: ACTION_CIRCUIT_ADD,
  payload: { circuitId: circuitId ?? uuidV4(), circuitName, edit },
});
export type AddCircuitAction = ReturnType<typeof addCircuit>;
export function isAddCircuitAction(
  action: AnyAction
): action is AddCircuitAction {
  return action.type === ACTION_CIRCUIT_ADD;
}
