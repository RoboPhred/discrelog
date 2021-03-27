import { AppState } from "@/store";

import {
  dotProduct,
  magnitude,
  normalize,
  Point,
  pointAdd,
  pointEquals,
  pointSubtract,
  scale,
  snapValue,
  ZeroPoint,
} from "@/geometry";
import { immutableEmptyArray } from "@/arrays";

import {
  elementPinFromPointSelector,
  elementPinPositionFromElementPinSelector,
} from "@/services/circuit-layout/selectors/element-pin-positions";
import { circuitIdForEditorIdSelector } from "@/services/circuit-editors/selectors/editor";
import {
  ElementPin,
  elementPinEquals,
  JointWireConnectTarget,
  SegmentWireConnectTarget,
  WireConnectTarget,
} from "@/services/circuit-graph/types";
import {
  endPositionForWireSegmentId,
  startPositionForWireSegmentId,
  wireJointPositionFromJointIdSelector,
} from "@/services/circuit-graph/selectors/wire-positions";
import {
  wireIdsFromCircuitIdSelector,
  wireJointIdsFromWireIdSelector,
  wireSegmentIdsFromWireIdSelector,
} from "@/services/circuit-graph/selectors/wires";

import { applyGridJointSnapSelector, gridJointSnapSelector } from "./snap";

function wireJointFromPoint(
  state: AppState,
  circuitId: string,
  p: Point
): JointWireConnectTarget | null {
  const wireIds = wireIdsFromCircuitIdSelector(state, circuitId);
  for (const wireId of wireIds) {
    const jointIds = wireJointIdsFromWireIdSelector(state, wireId);
    for (const jointId of jointIds) {
      const jointPos = wireJointPositionFromJointIdSelector(state, jointId);
      if (magnitude(pointSubtract(p, jointPos)) > 4) {
        continue;
      }

      return {
        type: "joint",
        jointId,
      };
    }
  }

  return null;
}

function wireSegmentFromPoint(
  state: AppState,
  circuitId: string,
  p: Point,
  snapToGrid: boolean
): SegmentWireConnectTarget | null {
  const snap = gridJointSnapSelector(state);
  const wireIds = wireIdsFromCircuitIdSelector(state, circuitId);
  for (const wireId of wireIds) {
    const segmentIds = wireSegmentIdsFromWireIdSelector(state, wireId);
    for (const segmentId of segmentIds) {
      const startPos = startPositionForWireSegmentId(state, segmentId);
      const endPos = endPositionForWireSegmentId(state, segmentId);

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
        segmentId,
        segmentInsertLength: magnitude(pointSubtract(dotPos, startPos)),
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
): WireConnectTarget | null => {
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

  const jointTarget = wireJointFromPoint(state, circuitId, p);
  if (jointTarget) {
    return jointTarget;
  }

  const segmentTarget = wireSegmentFromPoint(state, circuitId, p, snapToGrid);
  if (segmentTarget) {
    return segmentTarget;
  }

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
): WireConnectTarget | null => {
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

let dragWireTargetPinCache: ElementPin | null = null;
export const dragWireTargetPinSelector = (
  state: AppState
): ElementPin | null => {
  const dropTarget = dragWireEndTargetSelector(state);
  if (!dropTarget || dropTarget.type !== "pin") {
    return null;
  }

  const pin = dropTarget.pin;
  if (
    !dragWireTargetPinCache ||
    !elementPinEquals(dragWireTargetPinCache, pin)
  ) {
    dragWireTargetPinCache = pin;
  }

  return dragWireTargetPinCache;
};

function getDragTargetPoint(
  state: AppState,
  target: WireConnectTarget
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
      const { segmentId, segmentInsertLength } = target;
      const startPos = startPositionForWireSegmentId(state, segmentId);
      const endPos = endPositionForWireSegmentId(state, segmentId);
      const lineVector = normalize(pointSubtract(endPos, startPos));
      const fracPos = pointAdd(
        startPos,
        scale(lineVector, segmentInsertLength)
      );
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

let dragWireSegmentEndPositionCache: Point = ZeroPoint;
export const dragWireSegmentEndPositionSelector = (state: AppState) => {
  const endTarget = dragWireEndTargetSelector(state);
  if (!endTarget) {
    return null;
  }

  const pt = getDragTargetPoint(state, endTarget);
  if (!pt) {
    return null;
  }

  if (!pointEquals(pt, dragWireSegmentEndPositionCache)) {
    dragWireSegmentEndPositionCache = pt;
  }

  return dragWireSegmentEndPositionCache;
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

export const dragJointGhostLinesSelector = (
  state: AppState
): [start: Point, end: Point][] => {
  const dragService = state.services.circuitEditorDrag;
  if (dragService.dragMode !== "wire-segment-new-joint") {
    return immutableEmptyArray<[Point, Point]>();
  }

  const { dragWireSegmentId } = dragService;
  const jointPosition = dragWireJointPositionSelector(state);
  if (!dragWireSegmentId || !jointPosition) {
    return immutableEmptyArray<[Point, Point]>();
  }

  const startPos = startPositionForWireSegmentId(state, dragWireSegmentId);
  const endPos = endPositionForWireSegmentId(state, dragWireSegmentId);
  if (!startPos || !endPos) {
    return immutableEmptyArray<[Point, Point]>();
  }

  return [
    [startPos, jointPosition],
    [jointPosition, endPos],
  ];
};
