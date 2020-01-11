import { AnyAction } from "redux";

export const ACTION_SIM_STOP = "@sim/stop" as const;
export const stopSim = () => ({
  type: ACTION_SIM_STOP
});
export type StartSimAction = ReturnType<typeof stopSim>;
export function isStopSimAction(action: AnyAction): action is StartSimAction {
  return action.type === ACTION_SIM_STOP;
}
