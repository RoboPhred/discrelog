import { AppState } from "@/store";

import { normalize, Point, pointAdd, pointSubtract, scale } from "@/geometry";

import {
  elementPinFromPointSelector,
  elementPinPositionFromElementPinSelector,
} from "@/services/circuit-layout/selectors/element-pin-positions";
import { circuitIdForEditorIdSelector } from "@/services/circuit-editors/selectors/editor";
import { ElementPin } from "@/services/circuit-graph/types";
import {
  endPositionByWireSegmentId,
  startPositionByWireSegmentId,
} from "@/services/circuit-graph/selectors/wire-positions";

import { CircuitEditorDragWireTarget } from "../types";
import { applyGridJointSnapSelector } from "./snap";

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

  // TODO: Check for dropping on wire segments

  if (dragModifierKeys.shiftKey) {
    // Restrict to ordinals
    const startPos = dragWireSegmentStartPositionSelector(state);
    if (startPos) {
      const lineVector = normalize(pointSubtract(p, startPos));
      if (Math.abs(lineVector.x) >= 0.5) {
        p = {
          x: p.x,
          y: startPos.y,
        };
      } else {
        p = {
          x: startPos.x,
          y: p.y,
        };
      }
    }
  }

  if (!dragModifierKeys.ctrlMetaKey) {
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
