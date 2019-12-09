import { Point } from "@/types";

import { interactNode } from "@/services/simulator/actions/node-interact";
import { evolveSim } from "@/services/simulator/actions/sim-evolve";
import { fastForwardSim } from "@/services/simulator/actions/sim-fastforward";

import { SelectionMode } from "@/pages/CircuitEditor/types";
import { selectNodes } from "@/pages/CircuitEditor/actions/select-nodes";
import { clearSelection } from "@/pages/CircuitEditor/actions/select-clear";
import { hoverNode } from "@/pages/CircuitEditor/actions/node-hover";
import { paste } from "@/pages/CircuitEditor/actions/clipboard-paste";
import { selectionDelete } from "@/pages/CircuitEditor/actions/selection-delete";
import { selectionCopy } from "@/pages/CircuitEditor/actions/selection-copy";

import { selectPin } from "./actions/select-pin";
import { dragContinue } from "./actions/drag-continue";
import { dragEnd } from "./actions/drag-end";
import { dragStartNode } from "./actions/drag-start-node";
import { dragStartSelect } from "./actions/drag-start-select";

export interface ModifierKeys {
  ctrlMetaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

export function onNodeClicked(nodeId: string, modifiers: ModifierKeys) {
  // Might want to make this into an action/reducer pair to complement the others.
  if (modifiers.altKey) {
    return interactNode(nodeId);
  }

  const mode = getSelectMode(modifiers);
  return selectNodes(nodeId, mode);
}

export function onNodePinClicked(nodeId: string, pinId: string) {
  return selectPin(nodeId, pinId);
}

export function onFieldClicked(modifiers: ModifierKeys) {
  return clearSelection();
}

export function onNodeDragStart(
  nodeId: string,
  p: Point,
  modifiers: ModifierKeys
) {
  const selectMode = getSelectMode(modifiers);
  return dragStartNode(nodeId, p, selectMode);
}

export function onFieldDragStart(p: Point) {
  return dragStartSelect(p);
}

export function onDragMove(p: Point) {
  return dragContinue(p);
}

export function onDragEnd(p: Point, modifiers: ModifierKeys) {
  const mode = getSelectMode(modifiers);
  return dragEnd(p, mode);
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
  return selectionCopy();
}

export function onHotkeyPaste() {
  return paste();
}

export function onHotkeyDelete() {
  return selectionDelete();
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
