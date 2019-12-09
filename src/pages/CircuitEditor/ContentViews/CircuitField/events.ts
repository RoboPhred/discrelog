import { Dispatch } from "redux";

import { normalizeRectangle, pointSubtract } from "@/geometry";
import { GetState } from "@/store";
import { Point } from "@/types";

import { nodePinDirectionSelector } from "@/services/simulator/selectors/connections";
import { interactNode } from "@/services/simulator/actions/node-interact";
import { toggleWire } from "@/services/simulator/actions/wire-toggle";
import { evolveSim } from "@/services/simulator/actions/sim-evolve";
import { fastForwardSim } from "@/services/simulator/actions/sim-fastforward";

import { SelectionMode } from "@/pages/CircuitEditor/types";
import { selectNodes } from "@/pages/CircuitEditor/actions/select-nodes";
import { clearSelection } from "@/pages/CircuitEditor/actions/select-clear";
import { selectRegion } from "@/pages/CircuitEditor/actions/select-region";
import { moveNodes } from "@/pages/CircuitEditor/actions/node-move";
import { hoverNode } from "@/pages/CircuitEditor/actions/node-hover";
import { paste } from "@/pages/CircuitEditor/actions/clipboard-paste";
import { selectionDelete } from "@/pages/CircuitEditor/actions/selection-delete";
import { selectionCopy } from "@/pages/CircuitEditor/actions/selection-copy";

import { selectPin, startDrag, continueDrag, endDrag } from "./actions";
import { selectedPinSelector } from "./selectors";

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

export function onNodePinClicked(nodeId: string, pinId: string) {
  return function(dispatch: Dispatch, getState: GetState) {
    const state = getState();

    const clickedPinDirection = nodePinDirectionSelector(state, {
      nodeId,
      pinId
    });
    if (!clickedPinDirection) {
      return;
    }

    const selectedPin = selectedPinSelector(state);
    if (!selectedPin) {
      dispatch(selectPin(nodeId, pinId));
      return;
    }

    const selectedPinDirection = nodePinDirectionSelector(state, selectedPin);
    if (!selectedPinDirection) {
      dispatch(selectPin(nodeId, pinId));
      return;
    }

    if (selectedPinDirection !== clickedPinDirection) {
      dispatch(toggleWire(selectedPin, { nodeId, pinId }));
    } else {
      dispatch(selectPin(nodeId, pinId));
    }
  };
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
    dispatch(startDrag(p, "move-node"));
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
    const state = getState();
    const {
      dragMode,
      dragStart,
      dragEnd
    } = state.ui.circuitEditor.circuitField;
    const { selectedNodeIds } = state.ui.circuitEditor;

    if (dragStart && dragEnd) {
      switch (dragMode) {
        case "select": {
          const rect = normalizeRectangle(dragStart, dragEnd);
          const mode = getSelectMode(modifiers);
          dispatch(selectRegion(rect, mode));
          break;
        }
        case "move-node": {
          const moveBy = pointSubtract(dragEnd, dragStart);
          dispatch(moveNodes(selectedNodeIds, moveBy.x, moveBy.y));
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
