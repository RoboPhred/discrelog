import { Dispatch } from "redux";

import { normalizeRectangle, calcSize, positionSubtract } from "@/geometry";
import { GetState } from "@/store";
import { Position } from "@/types";

import { interactNode, evolveSim } from "@/services/simulator/actions";

import {
  clearSelection,
  hoverNode,
  selectNodes,
  SelectionMode,
  selectRegion,
  moveSelected
} from "@/pages/CircuitEditor/actions";

import { startDrag, continueDrag, endDrag } from "./actions";

import { circuitFieldState } from "./selectors";

export interface ModifierKeys {
  ctrlKey: boolean;
  shiftKey: boolean;
  altMetaKey: boolean;
}

export function onNodeClicked(nodeId: string, modifiers: ModifierKeys) {
  if (modifiers.altMetaKey) {
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
  p: Position,
  modifiers: ModifierKeys
) {
  return (dispatch: Dispatch) => {
    const mode = getSelectMode(modifiers);
    dispatch(selectNodes(nodeId, mode));
    dispatch(startDrag(p, "move"));
  };
}

export function onFieldDragStart(p: Position) {
  return startDrag(p, "select");
}

export function onDragMove(p: Position) {
  return continueDrag(p);
}

export function onDragEnd(p: Position, modifiers: ModifierKeys) {
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
          const moveBy = positionSubtract(dragEnd, dragStart);
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

function getSelectMode(modifiers: ModifierKeys): SelectionMode {
  if (modifiers.shiftKey && modifiers.ctrlKey) {
    return "remove";
  }
  if (modifiers.shiftKey) {
    return "append";
  }
  if (modifiers.ctrlKey) {
    return "toggle";
  }
  return "set";
}
