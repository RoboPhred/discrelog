import { createSelector } from "reselect";

import { magnitude, normalizeRectangle, pointSubtract } from "@/geometry";

import { nodePinPositionsByPinIdByNodeIdSelector } from "@/services/node-layout/selectors/node-positions";

import { createCircuitEditorUiSelector } from "../utils";

import { gridSnapSelector } from "./snap";

export const dragModeSelector = createCircuitEditorUiSelector(
  (s) => s.dragMode
);
export const dragStartSelector = createCircuitEditorUiSelector(
  (s) => s.dragStart
);
export const dragEndSelector = createCircuitEditorUiSelector((s) => s.dragEnd);

export const selectionRectSelector = createCircuitEditorUiSelector(
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

export const dragMoveOffsetSelector = createCircuitEditorUiSelector(
  createSelector(
    dragModeSelector.local,
    dragStartSelector.local,
    dragEndSelector.local,
    gridSnapSelector.local,
    (dragMode, dragStart, dragEnd, gridSnap) =>
      dragMode === "move" && dragStart && dragEnd
        ? {
            x: Math.round((dragEnd.x - dragStart.x) / gridSnap) * gridSnap,
            y: Math.round((dragEnd.y - dragStart.y) / gridSnap) * gridSnap,
          }
        : null
  )
);

export const isDraggingNewNodeSelector = createCircuitEditorUiSelector(
  (s) => s.dragMode === "new-node"
);

export const dragNewNodeTypeSelector = createCircuitEditorUiSelector((s) =>
  s.dragMode === "new-node" ? s.dragNewNodeType : null
);

export const dragWireTargetPinSelector = createSelector(
  dragModeSelector,
  dragEndSelector,
  nodePinPositionsByPinIdByNodeIdSelector,
  (dragMode, dragEnd, pinPositionsByPinIdByNodeId) => {
    if (dragMode !== "wire" || !dragEnd) {
      return null;
    }

    const nodeIds = Object.keys(pinPositionsByPinIdByNodeId);
    for (const nodeId of nodeIds) {
      const pinPositionsByPinId = pinPositionsByPinIdByNodeId[nodeId];
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
