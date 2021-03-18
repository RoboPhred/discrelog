import { AnyAction } from "redux";

import { MaybeArray } from "@/arrays";
import { AnnotatedElement } from "@/services/tutorial/state";

export const ACTION_TUTORIAL_ANNOTATE = "@tutorial/annotate" as const;
export const tutorialAnnotate = (
  annotations: MaybeArray<AnnotatedElement>
) => ({
  type: ACTION_TUTORIAL_ANNOTATE,
  payload: { annotations },
});
export type TutorialAnnotateAction = ReturnType<typeof tutorialAnnotate>;
export function isTutorialAnnotateAction(
  action: AnyAction
): action is TutorialAnnotateAction {
  return action.type === ACTION_TUTORIAL_ANNOTATE;
}
