import { AnyAction } from "redux";

export const ACTION_CIRCUIT_VIEW = "@circuit/view" as const;
export const viewCircuit = (
  circuitId: string,
  circuitNodeIdPath: string[] | null = null
) => ({
  type: ACTION_CIRCUIT_VIEW,
  payload: { circuitId, circuitNodeIdPath },
});
export type ViewCircuitAction = ReturnType<typeof viewCircuit>;
export function isViewCircuitAction(
  action: AnyAction
): action is ViewCircuitAction {
  return action.type === ACTION_CIRCUIT_VIEW;
}
