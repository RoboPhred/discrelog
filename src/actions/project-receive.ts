import { AnyAction } from "redux";

import { SaveData } from "@/services/savedata/types";

export const ACTION_PROJECT_RECEIVE = "@project/receive" as const;
export const receiveProject = (fileName: string, saveData: SaveData) => ({
  type: ACTION_PROJECT_RECEIVE,
  payload: { fileName, saveData },
});
export type ReceiveProjectAction = ReturnType<typeof receiveProject>;
export function isReceiveProjectAction(
  action: AnyAction
): action is ReceiveProjectAction {
  return action.type === ACTION_PROJECT_RECEIVE;
}
