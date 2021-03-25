import { AppState } from "@/store";

import {
  dotProduct,
  magnitude,
  normalize,
  Point,
  pointAdd,
  pointSubtract,
  scale,
  snapValue,
} from "@/geometry";

import {
  elementPinFromPointSelector,
  elementPinPositionFromElementPinSelector,
} from "@/services/circuit-layout/selectors/element-pin-positions";
import { circuitIdForEditorIdSelector } from "@/services/circuit-editors/selectors/editor";
import { ElementPin } from "@/services/circuit-graph/types";
import {
  endPositionByWireSegmentId,
  startPositionByWireSegmentId,
  wireJointPositionFromJointIdSelector,
} from "@/services/circuit-graph/selectors/wire-positions";
import {
  wireIdsFromCircuitIdSelector,
  wireSegmentIdsFromWireIdSelector,
} from "@/services/circuit-graph/selectors/wires";

import {
  CircuitEditorDragWireSegmentTarget,
  CircuitEditorDragWireTarget,
} from "../types";

import { applyGridJointSnapSelector, gridJointSnapSelector } from "./snap";

function wireSegmentFromPoint(
  state: AppState,
  circuitId: string,
  p: Point,
  snapToGrid: boolean
): CircuitEditorDragWireSegmentTarget | null {
  const snap = gridJointSnapSelector(state);
  const wireIds = wireIdsFromCircuitIdSelector(state, circuitId);
  for (const wireId of wireIds) {
    const segmentIds = wireSegmentIdsFromWireIdSelector(state, wireId);
    for (const segmentId of segmentIds) {
      const startPos = startPositionByWireSegmentId(state, segmentId);
      const endPos = endPositionByWireSegmentId(state, segmentId);

      const lineSub = pointSubtract(endPos, startPos);
      const length = magnitude(lineSub);
      const lineVector = normalize(lineSub);

      const v = pointSubtract(p, startPos);
      const distanceAlongLine = dotProduct(v, lineVector);

      if (distanceAlongLine < 0 || distanceAlongLine > length) {
        continue;
      }

      const dotPos = pointAdd(startPos, scale(lineVector, distanceAlongLine));
      if (snapToGrid) {
        // If snapping is enabled, snap to the axis the line follows.
        if (Math.abs(lineVector.x) === 1) {
          dotPos.x = snapValue(dotPos.x, snap);
        }
        if (Math.abs(lineVector.y) === 1) {
          dotPos.y = snapValue(dotPos.y, snap);
        }
      }

      const lineToDotDist = magnitude(pointSubtract(p, dotPos));
      if (lineToDotDist > 4) {
        continue;
      }

      return {
        type: "segment",
        wireId,
        segmentId,
        segmentSplitLength: magnitude(pointSubtract(dotPos, startPos)),
      };
    }
  }

  return null;
}

/**
 * Gets the drag target at the given point.
 *
 * WARN: Not react safe.  For reducer use only.
 */
export const dragWireEndTargetByPointSelector = (
  state: AppState,
  p: Point
): CircuitEditorDragWireTarget | null => {
  const dragService = state.services.circuitEditorDrag;
  if (dragService.dragMode !== "wire") {
    return null;
  }

  const { dragStartEditorId, dragModifierKeys } = dragService;
  const snapToGrid = !dragModifierKeys.ctrlMetaKey;
  const circuitId = circuitIdForEditorIdSelector(state, dragStartEditorId);
  if (!circuitId) {
    return null;
  }

  const targetPin = elementPinFromPointSelector(state, p, circuitId);
  if (targetPin) {
    return {
      type: "pin",
      pin: targetPin,
    };
  }

  const segmentTarget = wireSegmentFromPoint(state, circuitId, p, snapToGrid);
  if (segmentTarget) {
    return segmentTarget;
  }

  // TODO: Check for dropping on joints.

  const snap = gridJointSnapSelector(state);
  if (!dragModifierKeys.shiftKey) {
    // Restrict to ordinals
    const startPos = dragWireSegmentStartPositionSelector(state);
    if (startPos) {
      const lineVector = normalize(pointSubtract(p, startPos));
      if (Math.abs(lineVector.x) >= 0.5) {
        p = {
          x: snapToGrid ? snapValue(p.x, snap) : p.x,
          y: startPos.y,
        };
      } else {
        p = {
          x: startPos.x,
          y: snapToGrid ? snapValue(p.y, snap) : p.y,
        };
      }
    }
  } else if (snapToGrid) {
    p = applyGridJointSnapSelector(state, p);
  }

  return {
    type: "floating",
    point: p,
  };
};

export const dragWireEndTargetSelector = (
  state: AppState
): CircuitEditorDragWireTarget | null => {
  const dragService = state.services.circuitEditorDrag;
  if (dragService.dragMode !== "wire") {
    return null;
  }

  const { dragEnd } = dragService;
  if (!dragEnd) {
    return null;
  }

  return dragWireEndTargetByPointSelector(state, dragEnd);
};

export const dragWireTargetPinSelector = (
  state: AppState
): ElementPin | null => {
  const dropTarget = dragWireEndTargetSelector(state);
  if (!dropTarget || dropTarget.type !== "pin") {
    return null;
  }

  return dropTarget.pin;
};

export function getDragTargetPoint(
  state: AppState,
  target: CircuitEditorDragWireTarget
): Point | null {
  switch (target.type) {
    case "floating":
      return target.point;
    case "pin":
      return elementPinPositionFromElementPinSelector(
        state,
        target.pin.elementId,
        target.pin.pinId
      );
    case "segment": {
      const { segmentId, segmentSplitLength } = target;
      const startPos = startPositionByWireSegmentId(state, segmentId);
      const endPos = endPositionByWireSegmentId(state, segmentId);
      const lineVector = normalize(pointSubtract(endPos, startPos));
      const fracPos = pointAdd(startPos, scale(lineVector, segmentSplitLength));
      return fracPos;
    }
    case "joint":
      return wireJointPositionFromJointIdSelector(state, target.jointId);
  }

  return null;
}

export const dragWireSegmentStartPositionSelector = (state: AppState) => {
  const dragService = state.services.circuitEditorDrag;
  if (dragService.dragMode !== "wire") {
    return null;
  }

  return getDragTargetPoint(state, dragService.dragStartTarget);
};

export const dragWireSegmentEndPositionSelector = (state: AppState) => {
  const endTarget = dragWireEndTargetSelector(state);
  if (!endTarget) {
    return null;
  }

  return getDragTargetPoint(state, endTarget);
};

export const dragWireJointPositionSelector = (state: AppState) => {
  const dragService = state.services.circuitEditorDrag;
  if (dragService.dragMode !== "wire-segment-new-joint") {
    return null;
  }

  let dragEnd = dragService.dragEnd;
  if (!dragEnd) {
    return null;
  }

  if (!dragService.dragModifierKeys.ctrlMetaKey) {
    dragEnd = applyGridJointSnapSelector(state, dragEnd);
  }

  return dragEnd;
};
