import { AnyAction } from "redux";

export const ACTION_DIALOG_RESPONSE_ACCEPT = "@dialog/response/accept" as const;
export const acceptDialog = (result: any) => ({
  type: ACTION_DIALOG_RESPONSE_ACCEPT,
  payload: { result },
});
export type AcceptDialogAction = ReturnType<typeof acceptDialog>;
export function isAcceptDialogAction(
  action: AnyAction
): action is AcceptDialogAction {
  return action.type === ACTION_DIALOG_RESPONSE_ACCEPT;
}
