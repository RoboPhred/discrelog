import { Dispatch } from "redux";

import { normalizeRectangle, calcSize, positionSubtract } from "@/geometry";
import { GetState } from "@/store";
import { Position } from "@/types";

import { interactNode } from "@/services/simulator/actions";

import {
  clearSelection,
  mouseOverNode,
  selectNode,
  SelectionMode,
  selectRegion,
  moveSelected
} from "@/pages/CircuitEditor/actions";

import {
  startFieldDrag,
  startNodeDrag,
  continueDrag,
  endDrag
} from "./actions";

import { circuitFieldState } from "./selectors";

export interface ModifierKeys {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

export function onNodeClicked(nodeId: string, modifiers: ModifierKeys) {
  if (modifiers.altKey) {
    return interactNode(nodeId);
  }

  const mode = getSelectMode(modifiers);
  return selectNode(nodeId, mode);
}

export function onFieldClicked(modifiers: ModifierKeys) {
  return clearSelection();
}

export function onNodeDragStart(nodeId: string, p: Position) {
  return startNodeDrag(nodeId, p);
}

export function onFieldDragStart(p: Position) {
  return startFieldDrag(p);
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
  return mouseOverNode(nodeId);
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
