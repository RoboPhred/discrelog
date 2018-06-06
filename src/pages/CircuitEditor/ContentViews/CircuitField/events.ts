import { Dispatch } from "redux";

import { normalizeRectangle, calcSize, pointSubtract } from "@/geometry";
import { GetState } from "@/store";
import { Point } from "@/types";

import {
  interactNode,
  evolveSim,
  fastForwardSim,
  deleteNode
} from "@/services/simulator/actions";

import {
  clearSelection,
  hoverNode,
  selectNodes,
  SelectionMode,
  selectRegion,
  moveSelected,
  copySelected,
  paste
} from "@/pages/CircuitEditor/actions";

import { startDrag, continueDrag, endDrag } from "./actions";

import { circuitFieldState } from "./selectors";
import { selectedNodeIds } from "@/pages/CircuitEditor/selectors";

export interface ModifierKeys {
  ctrlMetaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

export function onNodeClicked(nodeId: string, modifiers: ModifierKeys) {
  if (modifiers.altKey) {
    return interactNode(nodeId);
  }

  const mode = getSelectMode(modifiers);
  return selectNodes(nodeId, mode);
}

export function onFieldClicked(modifiers: ModifierKeys) {
  return clearSelection();
}

export function onNodeDragStart(
  nodeId: string,
  p: Point,
  modifiers: ModifierKeys
) {
  return (dispatch: Dispatch, getState: GetState) => {
    // TODO: Move logic into reducer.
    const state = getState();
    const isNodeSelected =
      state.ui.circuitEditor.selectedNodeIds.indexOf(nodeId) !== -1;
    if (!isNodeSelected) {
      const mode = getSelectMode(modifiers);
      dispatch(selectNodes(nodeId, mode));
    }
    dispatch(startDrag(p, "move"));
  };
}

export function onFieldDragStart(p: Point) {
  return startDrag(p, "select");
}

export function onDragMove(p: Point) {
  return continueDrag(p);
}

export function onDragEnd(p: Point, modifiers: ModifierKeys) {
  return (dispatch: Dispatch, getState: GetState) => {
    const fieldState = circuitFieldState(getState());
    const { dragMode, dragStart, dragEnd } = fieldState;
    if (dragStart && dragEnd) {
      switch (dragMode) {
        case "select": {
          const rect = normalizeRectangle(dragStart, dragEnd);
          const mode = getSelectMode(modifiers);
          dispatch(selectRegion(rect, mode));
          break;
        }
        case "move": {
          const moveBy = pointSubtract(dragEnd, dragStart);
          dispatch(moveSelected(moveBy.x, moveBy.y));
          break;
        }
      }
    }
    dispatch(endDrag());
  };
}

export function onNodeHover(nodeId: string | null) {
  return hoverNode(nodeId);
}

export function onHotkeyStep() {
  return evolveSim(1);
}

export function onHotkeyFastForward() {
  return fastForwardSim();
}

export function onHotkeyCopy() {
  return copySelected();
}

export function onHotkeyPaste() {
  return paste();
}

export function onHotkeyDelete() {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const selectedIds = selectedNodeIds(state);
    if (selectedIds.length === 0) {
      return;
    }
    dispatch(deleteNode(selectedIds));
  };
}

function getSelectMode(modifiers: ModifierKeys): SelectionMode {
  if (modifiers.shiftKey && modifiers.ctrlMetaKey) {
    return "remove";
  }
  if (modifiers.shiftKey) {
    return "append";
  }
  if (modifiers.ctrlMetaKey) {
    return "toggle";
  }
  return "set";
}
