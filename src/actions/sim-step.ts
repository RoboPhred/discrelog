import { AnyAction } from "redux";

export const ACTION_SIM_STEP = "@sim/step" as const;
export const stepSim = () => ({
  type: ACTION_SIM_STEP,
});
export type StepSimAction = ReturnType<typeof stepSim>;
export function isStepSimAction(action: AnyAction): action is StepSimAction {
  return action.type === ACTION_SIM_STEP;
}
