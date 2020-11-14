import { AnyAction } from "redux";

export const ACTION_SELECT_PIN = "@editor/field/select-pin" as const;
export const selectPin = (nodeId: string, pinId: string) => ({
  type: ACTION_SELECT_PIN,
  payload: {
    nodeId,
    pinId,
  },
});
export type SelectPinAction = ReturnType<typeof selectPin>;
export function isSelectPinAction(
  action: AnyAction
): action is SelectPinAction {
  return action.type === ACTION_SELECT_PIN;
}
