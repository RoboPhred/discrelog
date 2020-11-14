import { AnyAction } from "redux";

export const ACTION_SIM_START = "@sim/start" as const;
export const startSim = () => ({
  type: ACTION_SIM_START,
});
export type StartSimAction = ReturnType<typeof startSim>;
export function isStartSimAction(action: AnyAction): action is StartSimAction {
  return action.type === ACTION_SIM_START;
}
