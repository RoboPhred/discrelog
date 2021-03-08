import { AnyAction } from "redux";

interface ViewCircuitOpts {
  newWindow?: boolean;
  tesselPath?: string[];
}
export const ACTION_VIEW_CIRCUIT = "@view/circuit" as const;
export const viewCircuit = (
  circuitId: string,
  circuitNodeIdPath: string[] | null = null,
  opts: ViewCircuitOpts = {}
) => ({
  type: ACTION_VIEW_CIRCUIT,
  payload: { circuitId, circuitNodeIdPath, ...opts },
});
export type ViewCircuitAction = ReturnType<typeof viewCircuit>;
export function isViewCircuitAction(
  action: AnyAction
): action is ViewCircuitAction {
  return action.type === ACTION_VIEW_CIRCUIT;
}
