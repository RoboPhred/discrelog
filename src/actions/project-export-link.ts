import { AnyAction } from "redux";

export const ACTION_PROJECT_EXPORT_LINK = "@project/export-link" as const;
export const exportProjectLink = () => ({
  type: ACTION_PROJECT_EXPORT_LINK,
});
export type ExportProjectLinkAction = ReturnType<typeof exportProjectLink>;
export function isExportProjectLinkAction(
  action: AnyAction
): action is ExportProjectLinkAction {
  return action.type === ACTION_PROJECT_EXPORT_LINK;
}
