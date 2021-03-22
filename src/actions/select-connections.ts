import { AnyAction } from "redux";

import { SelectionMode } from "@/selection-mode";

export const ACTION_SELECT_CONNECTIONS = "@select/connections" as const;
export const selectConnections = (
  connectionId: string | string[],
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_CONNECTIONS,
  payload: {
    connectionIds: Array.isArray(connectionId) ? connectionId : [connectionId],
    mode,
  },
});
export type SelectConnectionsAction = ReturnType<typeof selectConnections>;
export function isSelectConnectionsAction(
  action: AnyAction
): action is SelectConnectionsAction {
  return action.type === ACTION_SELECT_CONNECTIONS;
}
