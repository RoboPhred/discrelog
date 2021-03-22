import { AnyAction } from "redux";

export const ACTION_WIRE_DETATCH = "@wire/detatch" as const;
export const detatchWire = (connectionId: string) => ({
  type: ACTION_WIRE_DETATCH,
  payload: {
    connectionId,
  },
});
export type DetatchWireAction = ReturnType<typeof detatchWire>;
export function isDetatchWireAction(
  action: AnyAction
): action is DetatchWireAction {
  return action.type === ACTION_WIRE_DETATCH;
}
