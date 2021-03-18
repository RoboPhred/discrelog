import { AnyAction } from "redux";

export const ACTION_TUTORIAL_NEXT = "@tutorial/next" as const;
export const tutorialNext = () => ({
  type: ACTION_TUTORIAL_NEXT,
});
export type TutorialNextAction = ReturnType<typeof tutorialNext>;
export function isTutorialNextAction(
  action: AnyAction
): action is TutorialNextAction {
  return action.type === ACTION_TUTORIAL_NEXT;
}
