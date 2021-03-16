import { AnyAction } from "redux";

import { AppState } from "@/store";

import { ACTION_CIRCUIT_EDITOR_DRAG_CONTINUE } from "@/actions/circuit-editor-drag-continue";
import { ACTION_CIRCUIT_EDITOR_MOUSE_LEAVE } from "@/actions/circuit-editor-mouse-leave";
import { ACTION_SIM_TICK } from "@/actions/sim-tick";

export const actionsBlacklist: string[] = [
  ACTION_CIRCUIT_EDITOR_DRAG_CONTINUE,
  ACTION_CIRCUIT_EDITOR_MOUSE_LEAVE,
  ACTION_SIM_TICK,
];

export function actionSanitizer(action: AnyAction): AnyAction {
  return action;
}

export function stateSanitizer(state: AppState): any {
  return state;
}
