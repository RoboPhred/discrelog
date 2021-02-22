import { AnyAction } from "redux";

export const ACTION_PROJECT_IMPORT_LINK = "@project/import-link" as const;
export const importProjectLink = (data: string) => ({
  type: ACTION_PROJECT_IMPORT_LINK,
  payload: { data },
});
export type ImportProjectLinkAction = ReturnType<typeof importProjectLink>;
export function isImportProjectLinkAction(
  action: AnyAction
): action is ImportProjectLinkAction {
  return action.type === ACTION_PROJECT_IMPORT_LINK;
}
