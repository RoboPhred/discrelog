import { AnyAction } from "redux";

export const ACTION_SIM_TICK = "@sim/tick" as const;
export const tickSim = (tickCount: number) => ({
  type: ACTION_SIM_TICK,
  payload: { tickCount }
});
export type TickSimAction = ReturnType<typeof tickSim>;
export function isTickSimAction(action: AnyAction): action is TickSimAction {
  return action.type === ACTION_SIM_TICK;
}
