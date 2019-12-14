import { AnyAction } from "redux";

import { AppState } from "@/store";

import { ACTION_NODE_HOVER } from "@/pages/CircuitEditor/actions/node-hover";
import { ACTION_DRAG_CONTINUE } from "@/pages/CircuitEditor/ContentViews/CircuitFieldView/actions/drag-continue";

export const actionsBlacklist: string[] = [
  ACTION_DRAG_CONTINUE,
  ACTION_NODE_HOVER
];

export function actionSanitizer(action: AnyAction): AnyAction {
  return action;
}

export function stateSanitizer(state: AppState): any {
  return state;
}
