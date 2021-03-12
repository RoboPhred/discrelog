import { AnyAction } from "redux";

import { AppState } from "@/store";

import { ACTION_FIELD_DRAG_CONTINUE } from "@/actions/field-drag-continue";
import { ACTION_FIELD_MOUSE_LEAVE } from "@/actions/field-mouse-leave";
import { ACTION_SIM_TICK } from "@/actions/sim-tick";
import { ACTION_WIRE_JOINT_MOVE } from "@/actions/wire-joint-move";

export const actionsBlacklist: string[] = [
  ACTION_FIELD_DRAG_CONTINUE,
  ACTION_FIELD_MOUSE_LEAVE,
  ACTION_WIRE_JOINT_MOVE,
  ACTION_SIM_TICK,
];

export function actionSanitizer(action: AnyAction): AnyAction {
  return action;
}

export function stateSanitizer(state: AppState): any {
  return state;
}
