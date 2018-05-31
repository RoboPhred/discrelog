import { Position } from "@/types";

import { interactNode } from "@/services/simulator/actions";

import {
  clearSelection,
  mouseOverNode,
  selectNode,
  SelectionMode
} from "@/pages/CircuitEditor/actions";

export interface ModifierKeys {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

export function onNodeClicked(nodeId: string, modifiers: ModifierKeys) {
  if (modifiers.altKey) {
    return interactNode(nodeId);
  }

  let mode: SelectionMode = "set";
  if (modifiers.shiftKey && modifiers.ctrlKey) {
    mode = "remove";
  }
  if (modifiers.shiftKey) {
    mode = "append";
  } else if (modifiers.ctrlKey) {
    mode = "toggle";
  }

  return selectNode(nodeId, mode);
}

export function onFieldClicked(modifiers: ModifierKeys) {
  return clearSelection();
}

export function onNodeDragStart(nodeId: string, p: Position) {
  // TODO: Dispatch field action to prepare node drag preview.
}

export function onFieldDragStart(p: Position) {
  // TODO: Dispatch field action to prepare drag select box render.
}

export function onDragMove(p: Position) {
  // TODO: Dispatch field action to update drag move location.
}

export function onDragEnd(p: Position, modifiers: ModifierKeys) {
  // TODO: If node drag, dispatch CircuitEditor action to move node.
  //  Else if field drag, dispatch CircuitEditor selectRegion action
}

export function onNodeHover(nodeId: string | null) {
  return mouseOverNode(nodeId);
}
