import { v4 as uuidV4 } from "uuid";
import { AnyAction } from "redux";

import { ElementType } from "@/elements";
import { Point } from "@/geometry";

export interface AddElementOptions {
  nodeId?: string;
  circuitId?: string;
  position?: Point;
}
export const ACTION_ELEMENT_ADD = "@element/add" as const;
export const addElement = (
  elementType: ElementType,
  opts?: AddElementOptions
) => ({
  type: ACTION_ELEMENT_ADD,
  payload: { nodeId: uuidV4(), elementType, ...(opts || {}) },
});
export type AddElementAction = ReturnType<typeof addElement>;
export function isAddElementAction(
  action: AnyAction
): action is AddElementAction {
  return action.type === ACTION_ELEMENT_ADD;
}
