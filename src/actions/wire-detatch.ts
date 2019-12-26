import { AnyAction } from "redux";

export const ACTION_WIRE_DETATCH = "@wire/detatch" as const;
export const detatchWire = (wireId: string) => ({
  type: ACTION_WIRE_DETATCH,
  payload: {
    wireId
  }
});
export type DetatchWireNodeAction = ReturnType<typeof detatchWire>;
export function isDetatchWireAction(
  action: AnyAction
): action is DetatchWireNodeAction {
  return action.type === ACTION_WIRE_DETATCH;
}
