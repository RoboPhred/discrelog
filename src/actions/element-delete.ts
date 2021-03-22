import { AnyAction } from "redux";

import { asArray, MaybeArray } from "@/arrays";

export const ACTION_ELEMENT_DELETE = "@element/delete" as const;
export const deleteElement = (elementId: MaybeArray<string>) => ({
  type: ACTION_ELEMENT_DELETE,
  payload: { elementIds: asArray(elementId) },
});
export type DeleteElementAction = ReturnType<typeof deleteElement>;
export function isDeleteElementAction(
  action: AnyAction
): action is DeleteElementAction {
  return action.type === ACTION_ELEMENT_DELETE;
}
