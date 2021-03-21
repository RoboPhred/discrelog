import { v4 as uuidV4 } from "uuid";
import { AnyAction } from "redux";

import { Point } from "@/geometry";

export interface AddElementOptions {
  elementId?: string;
  elementName?: string;
}
export const ACTION_ELEMENT_ADD = "@element/add" as const;
export const addElement = (
  elementType: string,
  circuitId: string,
  position: Point,
  opts?: AddElementOptions
) => ({
  type: ACTION_ELEMENT_ADD,
  payload: {
    elementId: uuidV4(),
    elementType,
    circuitId,
    position,
    ...(opts || {}),
  },
});
export type AddElementAction = ReturnType<typeof addElement>;
export function isAddElementAction(
  action: AnyAction
): action is AddElementAction {
  return action.type === ACTION_ELEMENT_ADD;
}
