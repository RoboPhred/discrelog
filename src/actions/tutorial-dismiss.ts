import { AnyAction } from "redux";

export const ACTION_TUTORIAL_DISMISS = "@tutorial/dismiss" as const;
export const tutorialDismiss = () => ({
  type: ACTION_TUTORIAL_DISMISS,
});
export type TutorialDismissAction = ReturnType<typeof tutorialDismiss>;
export function isTutorialDismissAction(
  action: AnyAction
): action is TutorialDismissAction {
  return action.type === ACTION_TUTORIAL_DISMISS;
}
