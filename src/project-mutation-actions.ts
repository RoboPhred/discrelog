import { AnyAction } from "redux";

import { ACTION_CIRCUIT_ADD } from "@/actions/circuit-add";
import { ACTION_CIRCUIT_DELETE } from "@/actions/circuit-delete";
import { ACTION_CIRCUIT_RENAME } from "@/actions/circuit-rename";

import { ACTION_ELEMENT_ADD } from "@/actions/element-add";
import { ACTION_ELEMENT_DELETE } from "@/actions/element-delete";
import { ACTION_ELEMENT_RENAME } from "@/actions/element-rename";

import { ACTION_SELECTION_ALIGN_TO_GRID } from "@/actions/selection-align-to-grid";
import { ACTION_SELECTION_DELETE } from "@/actions/selection-delete";
import { ACTION_SELECTION_MOVE } from "@/actions/selection-move";

import { ACTION_PASTE } from "@/actions/clipboard-paste";
import { ACTION_CIRCUIT_EDITOR_DRAG_END } from "@/actions/circuit-editor-drag-end";

import { ACTION_UNDO } from "@/actions/undo";
import { ACTION_REDO } from "@/actions/redo";

import { ACTION_PROJECT_NEW } from "@/actions/project-new";
import { ACTION_PROJECT_RECEIVE } from "@/actions/project-receive";

import { ACTION_WIRE_CONNECT } from "@/actions/wire-connect";
import { ACTION_WIRE_HYDRATE } from "@/actions/wire-hydrate";
import { ACTION_WIRE_JOINT_MOVE } from "@/actions/wire-joint-move";
import { ACTION_WIRE_JOINT_DELETE } from "@/actions/wire-joint-delete";
import { ACTION_WIRE_SEGMENT_INSERT_JOINT } from "@/actions/wire-segment-insert-joint";
import { ACTION_WIRE_SEGMENT_SET_LINE } from "@/actions/wire-segment-set-line";

export const PROJECT_MUTATION_ACTIONS = [
  ACTION_CIRCUIT_ADD,
  ACTION_CIRCUIT_DELETE,
  ACTION_CIRCUIT_RENAME,

  ACTION_ELEMENT_ADD,
  ACTION_ELEMENT_DELETE,
  ACTION_ELEMENT_RENAME,

  ACTION_SELECTION_ALIGN_TO_GRID,
  ACTION_SELECTION_DELETE,
  ACTION_SELECTION_MOVE,

  ACTION_UNDO,
  ACTION_REDO,

  ACTION_WIRE_CONNECT,
  ACTION_WIRE_HYDRATE,
  ACTION_WIRE_JOINT_MOVE,
  ACTION_WIRE_JOINT_DELETE,
  ACTION_WIRE_SEGMENT_INSERT_JOINT,
  ACTION_WIRE_SEGMENT_SET_LINE,

  // These actions typically fire off other actions in this list,
  // and are redundant for services that take part in the core reducer.
  // However, undo/redo is outside of the core reducer and does not see the
  // reentrant actions in order to produce a single undo stack entry for
  // the entire paste operation.
  ACTION_PASTE,
  ACTION_CIRCUIT_EDITOR_DRAG_END,
];

export function isProjectMutationAction(action: AnyAction) {
  return PROJECT_MUTATION_ACTIONS.indexOf(action.type) !== -1;
}

export const PROJECT_RESET_ACTIONS = [
  ACTION_PROJECT_NEW,
  ACTION_PROJECT_RECEIVE,
];

export function isProjectResetAction(action: AnyAction) {
  return PROJECT_RESET_ACTIONS.indexOf(action.type) !== -1;
}
