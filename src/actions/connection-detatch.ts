import { AnyAction } from "redux";

export const ACTION_CONNECTION_DETATCH = "@connection/detatch" as const;
export const detatchConnection = (connectionId: string) => ({
  type: ACTION_CONNECTION_DETATCH,
  payload: {
    connectionId,
  },
});
export type DetatchConnectionAction = ReturnType<typeof detatchConnection>;
export function isDetatchConnectionAction(
  action: AnyAction
): action is DetatchConnectionAction {
  return action.type === ACTION_CONNECTION_DETATCH;
}
