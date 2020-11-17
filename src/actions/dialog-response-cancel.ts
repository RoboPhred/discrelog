import { AnyAction } from "redux";

export const ACTION_DIALOG_RESPONSE_CANCEL = "@dialog/response/cancel" as const;
export const cancelDialog = () => ({
  type: ACTION_DIALOG_RESPONSE_CANCEL,
});
export type CancelDialogAction = ReturnType<typeof cancelDialog>;
export function isCancelDialogAction(
  action: AnyAction
): action is CancelDialogAction {
  return action.type === ACTION_DIALOG_RESPONSE_CANCEL;
}
