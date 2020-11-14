import { AnyAction } from "redux";

export const ACTION_FILE_NEW = "@file/new" as const;
export const newFile = () => ({
  type: ACTION_FILE_NEW,
});
export type NewFileAction = ReturnType<typeof newFile>;
export function isNewFileAction(action: AnyAction): action is NewFileAction {
  return action.type === ACTION_FILE_NEW;
}
