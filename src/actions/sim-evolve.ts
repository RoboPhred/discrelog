import { AnyAction } from "redux";

export const ACTION_EVOLVE = "@sim/evolve" as const;
export const evolveSim = (tickCount: number) => ({
  type: ACTION_EVOLVE,
  payload: { tickCount }
});
export type EvolveSimAction = ReturnType<typeof evolveSim>;
export function isEvolveSimAction(
  action: AnyAction
): action is EvolveSimAction {
  return action.type === ACTION_EVOLVE;
}
