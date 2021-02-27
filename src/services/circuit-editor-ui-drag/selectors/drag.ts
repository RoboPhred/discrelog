import { createSelector } from "reselect";

import {
  magnitude,
  normalizeRectangle,
  pointSubtract,
  ZeroPoint,
} from "@/geometry";
import { MODIFIER_KEYS_NONE } from "@/modifier-keys";

import { nodePinPositionsByPinIdByNodeIdSelector } from "@/services/node-layout/selectors/node-pin-positions";
import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";
import { nodeIdsForEditingCircuitSelector } from "@/services/circuit-editor-ui-viewport/selectors/nodes";

import { createCircuitEditorUiDragSelector } from "../utils";

import { gridJointSnapSelector, gridNodeSnapSelector } from "./snap";

export const dragModeSelector = createCircuitEditorUiDragSelector(
  (s) => s.dragMode
);
export const dragStartSelector = createCircuitEditorUiDragSelector(
  (s) => s.dragStart
);
export const dragEndSelector = createCircuitEditorUiDragSelector(
  (s) => s.dragEnd
);

export const dragModifierKeysSelector = createCircuitEditorUiDragSelector(
  (s) => s.dragModifierKeys ?? MODIFIER_KEYS_NONE
);

export const selectionRectSelector = createCircuitEditorUiDragSelector(
  createSelector(
    dragModeSelector.local,
    dragStartSelector.local,
    dragEndSelector.local,
    (dragMode, dragStart, dragEnd) =>
      dragMode === "select" && dragStart && dragEnd
        ? normalizeRectangle(dragStart, dragEnd)
        : null
  )
);

export const dragMoveOffsetSelector = createSelector(
  dragModeSelector,
  selectedNodeIdsSelector,
  dragModifierKeysSelector,
  dragStartSelector,
  dragEndSelector,
  gridNodeSnapSelector,
  gridJointSnapSelector,
  (
    dragMode,
    selectedNodeIds,
    modifierKeys,
    dragStart,
    dragEnd,
    nodeSnap,
    jointSnap
  ) => {
    if (dragMode !== "move" || !dragStart || !dragEnd) {
      return null;
    }

    let gridSnap = jointSnap;
    if (selectedNodeIds.length > 0) {
      // If we are dragging nodes, restrict everything to the node snap size.
      gridSnap = nodeSnap;
    }

    const offset = pointSubtract(dragEnd, dragStart);
    if (!modifierKeys.ctrlMetaKey) {
      offset.x = Math.round(offset.x / gridSnap) * gridSnap;
      offset.y = Math.round(offset.y / gridSnap) * gridSnap;
    }

    return offset;
  }
);

export const dragNewJointPositionSelector = createCircuitEditorUiDragSelector(
  (state) => {
    const gridSnap = gridJointSnapSelector.local(state);

    const { dragMode, dragEnd, dragModifierKeys } = state;
    if (dragMode !== "new-joint" || !dragEnd || !dragModifierKeys) {
      return null;
    }

    const position = { ...dragEnd };
    if (!dragModifierKeys.ctrlMetaKey) {
      position.x = Math.round(position.x / gridSnap) * gridSnap;
      position.y = Math.round(position.y / gridSnap) * gridSnap;
    }

    return position;
  }
);

export const isDraggingNewNodeSelector = createCircuitEditorUiDragSelector(
  (s) => s.dragMode === "new-node"
);

export const dragNewNodeTypeSelector = createCircuitEditorUiDragSelector((s) =>
  s.dragMode === "new-node" ? s.dragNewNodeType : null
);

export const dragWireTargetPinSelector = createSelector(
  dragModeSelector,
  dragEndSelector,
  nodeIdsForEditingCircuitSelector,
  nodePinPositionsByPinIdByNodeIdSelector,
  (
    dragMode,
    dragEnd,
    nodeIdsForEditingCircuit,
    pinPositionsByPinIdByNodeId
  ) => {
    if (dragMode !== "wire" || !dragEnd) {
      return null;
    }

    for (const nodeId of nodeIdsForEditingCircuit) {
      const pinPositionsByPinId =
        pinPositionsByPinIdByNodeId[nodeId] ?? ZeroPoint;
      const pinIds = Object.keys(pinPositionsByPinId);
      for (const pinId of pinIds) {
        const pinPosition = pinPositionsByPinId[pinId];
        const offset = pointSubtract(dragEnd, pinPosition);
        const length = magnitude(offset);
        if (length <= 6) {
          return { nodeId, pinId };
        }
      }
    }

    return null;
  }
);
