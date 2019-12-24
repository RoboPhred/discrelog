import { AnyAction } from "redux";

import { AppState } from "@/store";

import { ACTION_DRAG_CONTINUE } from "@/pages/CircuitEditor/components/CircuitFieldView/components/CircuitField/actions/drag-continue";

export const actionsBlacklist: string[] = [ACTION_DRAG_CONTINUE];

export function actionSanitizer(action: AnyAction): AnyAction {
  return action;
}

export function stateSanitizer(state: AppState): any {
  return state;
}
