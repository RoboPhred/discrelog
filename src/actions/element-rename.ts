import { AnyAction } from "redux";

export const ACTION_ELEMENT_RENAME = "@element/rename" as const;
export const renameElement = (elementId: string, elementName: string) => ({
  type: ACTION_ELEMENT_RENAME,
  payload: { elementId, elementName },
});
export type RenameElementAction = ReturnType<typeof renameElement>;
export function isRenameElementAction(
  action: AnyAction
): action is RenameElementAction {
  return action.type === ACTION_ELEMENT_RENAME;
}
