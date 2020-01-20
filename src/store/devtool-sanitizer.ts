import { AnyAction } from "redux";

import { AppState } from "@/store";

import { ACTION_FIELD_DRAG_CONTINUE } from "@/actions/field-drag-continue";
import { ACTION_SIM_TICK } from "@/actions/sim-tick";
import { ACTION_VIEW_ZOOM } from "@/actions/view-zoom";

export const actionsBlacklist: string[] = [
  ACTION_FIELD_DRAG_CONTINUE,
  ACTION_SIM_TICK,
  ACTION_VIEW_ZOOM
];

export function actionSanitizer(action: AnyAction): AnyAction {
  return action;
}

export function stateSanitizer(state: AppState): any {
  return state;
}
