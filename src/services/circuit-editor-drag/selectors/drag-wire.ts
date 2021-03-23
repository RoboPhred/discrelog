import { AppState } from "@/store";

import { Point } from "@/geometry";

import { elementPinFromPointSelector } from "@/services/circuit-layout/selectors/element-pin-positions";
import { circuitIdForEditorIdSelector } from "@/services/circuit-editors/selectors/editor";
import { ElementPin } from "@/services/circuit-graph/types";

import { CircuitEditorDragWireTarget } from "../types";

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

  const { dragStartEditorId } = dragService;
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

export const dragDropTargetPinSelector = (
  state: AppState
): ElementPin | null => {
  const dropTarget = dragWireEndTargetSelector(state);
  if (!dropTarget || dropTarget.type !== "pin") {
    return null;
  }

  return dropTarget.pin;
};
