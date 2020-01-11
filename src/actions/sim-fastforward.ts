import { AnyAction } from "redux";

export const ACTION_SIM_FASTFORWARD = "@sim/fastforward" as const;
export const fastForwardSim = () => ({
  type: ACTION_SIM_FASTFORWARD
});
export type FastForwardSimAction = ReturnType<typeof fastForwardSim>;
export function isFastForwardSimAction(
  action: AnyAction
): action is FastForwardSimAction {
  return action.type === ACTION_SIM_FASTFORWARD;
}
