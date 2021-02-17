import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import { reducerPriority, PRIORITY_SAVE } from "@/store/priorities";

import { ACTION_CIRCUIT_ADD } from "@/actions/circuit-add";
import { ACTION_CIRCUIT_DELETE } from "@/actions/circuit-delete";
import { ACTION_CIRCUIT_RENAME } from "@/actions/circuit-rename";
import { ACTION_NODE_ADD } from "@/actions/node-add";
import { ACTION_NODE_DELETE } from "@/actions/node-delete";
import { ACTION_SELECTION_MOVE } from "@/actions/selection-move";
import { ACTION_WIRE_ATTACH } from "@/actions/wire-attach";
import { ACTION_WIRE_DETATCH } from "@/actions/wire-detatch";
import { ACTION_WIRE_JOINT_ADD } from "@/actions/wire-joint-add";
import { ACTION_WIRE_JOINT_MOVE } from "@/actions/wire-joint-move";

import { createSave, storeAutosave } from "../utils";
import { ACTION_WIRE_JOINT_DELETE } from "@/actions/wire-joint-delete";

const AUTOSAVE_TRIGGERS = [
  ACTION_NODE_ADD,
  ACTION_NODE_DELETE,
  ACTION_CIRCUIT_ADD,
  ACTION_CIRCUIT_DELETE,
  ACTION_CIRCUIT_RENAME,
  ACTION_SELECTION_MOVE,
  ACTION_WIRE_ATTACH,
  ACTION_WIRE_DETATCH,
  ACTION_WIRE_JOINT_ADD,
  ACTION_WIRE_JOINT_DELETE,
  ACTION_WIRE_JOINT_MOVE,
];

export default reducerPriority(
  PRIORITY_SAVE,
  (state: AppState = defaultAppState, action: AnyAction): AppState => {
    if (AUTOSAVE_TRIGGERS.indexOf(action.type) === -1) {
      return state;
    }

    const save = createSave(state);
    storeAutosave(save);

    return state;
  }
);
