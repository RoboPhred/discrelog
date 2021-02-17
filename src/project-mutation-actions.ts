import { AnyAction } from "redux";

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
import { ACTION_WIRE_JOINT_DELETE } from "@/actions/wire-joint-delete";

import { ACTION_PASTE } from "@/actions/clipboard-paste";
import { ACTION_FIELD_DRAG_END } from "@/actions/field-drag-end";

import { ACTION_UNDO } from "@/actions/undo";
import { ACTION_REDO } from "@/actions/redo";

export const PROJECT_MUTATION_ACTIONS = [
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

  ACTION_UNDO,
  ACTION_REDO,

  // These actions typically fire off other actions in this list,
  // and are redundant for services that take part in the core reducer.
  // However, undo/redo is outside of the core reducer and does not see the
  // reentrant actions in order to produce a single undo stack entry for
  // the entire paste operation.
  ACTION_PASTE,
  ACTION_FIELD_DRAG_END,
];

export function isProjectMutationAction(action: AnyAction) {
  return PROJECT_MUTATION_ACTIONS.indexOf(action.type) !== -1;
}
