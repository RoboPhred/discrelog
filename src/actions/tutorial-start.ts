import { AnyAction } from "redux";

export const ACTION_TUTORIAL_START = "@tutorial/start" as const;
export const tutorialStart = (tutorial: string) => ({
  type: ACTION_TUTORIAL_START,
  payload: { tutorial },
});
export type TutorialStartAction = ReturnType<typeof tutorialStart>;
export function isTutorialStartAction(
  action: AnyAction
): action is TutorialStartAction {
  return action.type === ACTION_TUTORIAL_START;
}
