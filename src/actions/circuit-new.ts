import { AnyAction } from "redux";
import { v4 as uuidV4 } from "uuid";

export const ACTION_CIRCUIT_NEW = "@circuit/new" as const;
export interface NewCircuitOpts {
  circuitName?: string;
  circuitId?: string;
  edit?: boolean;
}
export const newCircuit = ({
  circuitName,
  circuitId,
  edit,
}: NewCircuitOpts = {}) => ({
  type: ACTION_CIRCUIT_NEW,
  payload: { circuitId: circuitId ?? uuidV4(), circuitName, edit },
});
export type NewCircuitAction = ReturnType<typeof newCircuit>;
export function isNewCircuitAction(
  action: AnyAction
): action is NewCircuitAction {
  return action.type === ACTION_CIRCUIT_NEW;
}
