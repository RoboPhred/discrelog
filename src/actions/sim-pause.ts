import { AnyAction } from "redux";

export const ACTION_SIM_PAUSE = "@sim/pause" as const;
export const pauseSim = (mode: boolean | "toggle") => ({
  type: ACTION_SIM_PAUSE,
  payload: { mode },
});
export type PauseSimAction = ReturnType<typeof pauseSim>;
export function isPauseSimAction(action: AnyAction): action is PauseSimAction {
  return action.type === ACTION_SIM_PAUSE;
}
