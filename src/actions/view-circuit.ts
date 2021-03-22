import { AnyAction } from "redux";
import { v4 as uuidV4 } from "uuid";

interface ViewCircuitOpts {
  newWindow?: boolean;
}
export const ACTION_VIEW_CIRCUIT = "@view/circuit" as const;
export const viewCircuit = (
  circuitId: string,
  elementIdPath: string[] | null = null,
  opts: ViewCircuitOpts = {}
) => ({
  type: ACTION_VIEW_CIRCUIT,
  payload: {
    circuitId,
    elementIdPath,
    newWindowId: opts.newWindow ? uuidV4() : null,
  },
});
export type ViewCircuitAction = ReturnType<typeof viewCircuit>;
export function isViewCircuitAction(
  action: AnyAction
): action is ViewCircuitAction {
  return action.type === ACTION_VIEW_CIRCUIT;
}
