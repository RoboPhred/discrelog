import { AnyAction } from "redux";

import { DialogType } from "@/dialogs/types";

export const ACTION_DIALOG_SHOW = "@dialog/show" as const;
export const showDialog = (dialogType: DialogType, data: any) => ({
  type: ACTION_DIALOG_SHOW,
  payload: { dialogType, data },
});
export type ShowDialogAction = ReturnType<typeof showDialog>;
export function isShowDialogAction(
  action: AnyAction
): action is ShowDialogAction {
  return action.type === ACTION_DIALOG_SHOW;
}
