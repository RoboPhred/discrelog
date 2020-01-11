import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";

import { ACTION_NODE_ADD } from "@/actions/node-add";
import { ACTION_NODE_DELETE } from "@/actions/node-delete";
import { ACTION_SELECTION_MOVE } from "@/actions/selection-move";
import { ACTION_WIRE_ATTACH } from "@/actions/wire-attach";
import { ACTION_WIRE_DETATCH } from "@/actions/wire-detatch";
import { ACTION_WIRE_JOINT_ADD } from "@/actions/wire-joint-add";
import { ACTION_WIRE_JOINT_MOVE } from "@/actions/wire-joint-move";

import { createSave, storeAutosave } from "../utils";

const AUTOSAVE_TRIGGERS = [
  ACTION_NODE_ADD,
  ACTION_NODE_DELETE,
  ACTION_SELECTION_MOVE,
  ACTION_WIRE_ATTACH,
  ACTION_WIRE_DETATCH,
  ACTION_WIRE_JOINT_ADD,
  ACTION_WIRE_JOINT_MOVE
];

export default function autoSaveReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (AUTOSAVE_TRIGGERS.indexOf(action.type) === -1) {
    return state;
  }

  const save = createSave(state);
  storeAutosave(save);

  return state;
}
