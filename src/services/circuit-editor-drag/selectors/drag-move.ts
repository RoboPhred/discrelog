import { AppState } from "@/store";

import {
  normalize,
  Point,
  pointAdd,
  pointEquals,
  pointSubtract,
  snapPoint,
  ZeroPoint,
} from "@/geometry";

import {
  selectedElementIdsSelector,
  selectedJointIdsSelector,
} from "@/services/selection/selectors/selection";

import { gridElementSnapSelector, gridJointSnapSelector } from "./snap";
import { immutableEmptyArray } from "@/arrays";
import { segmentIdsForJointIdSelector } from "@/services/circuit-graph/selectors/wires";
import { WireSegment } from "@/services/circuit-graph/types";
import { elementPinPositionFromElementPinSelector } from "@/services/circuit-layout/selectors/element-pin-positions";
import { wireJointPositionFromJointIdSelector } from "@/services/circuit-graph/selectors/wire-positions";

let cachedDragMoveOffset: Point | null = null;
export const dragMoveOffsetSelector = (state: AppState) => {
  const dragState = state.services.circuitEditorDrag;
  if (dragState.dragMode !== "move") {
    return null;
  }

  const selectedElementIds = selectedElementIdsSelector(state);

  let gridSnap: number;
  if (selectedElementIds.length > 0) {
    gridSnap = gridElementSnapSelector(state);
  } else {
    gridSnap = gridJointSnapSelector(state);
  }

  const { dragStart, dragEnd, dragModifierKeys } = dragState;
  if (!dragEnd) {
    return null;
  }

  let offset = pointSubtract(dragEnd, dragStart);

  if (dragModifierKeys.shiftKey) {
    const lineVector = normalize(pointSubtract(dragEnd, dragStart));
    if (Math.abs(lineVector.x) >= 0.5) {
      offset = {
        x: offset.x,
        y: 0,
      };
    } else {
      offset = {
        x: 0,
        y: offset.y,
      };
    }
  }

  if (!dragModifierKeys.ctrlMetaKey) {
    offset = snapPoint(offset, gridSnap);
  }

  if (!cachedDragMoveOffset || !pointEquals(offset, cachedDragMoveOffset)) {
    cachedDragMoveOffset = offset;
  }

  return cachedDragMoveOffset;
};

export const dragMoveGhostLinesSelector = (
  state: AppState
): [start: Point, end: Point][] => {
  const dragService = state.services.circuitEditorDrag;
  if (dragService.dragMode !== "move") {
    return immutableEmptyArray<[Point, Point]>();
  }

  const selectedJointIds = selectedJointIdsSelector(state);
  const offset = dragMoveOffsetSelector(state);
  if (!offset) {
    return immutableEmptyArray<[Point, Point]>();
  }

  function getJointPosition(jointId: string) {
    let pos = wireJointPositionFromJointIdSelector(state, jointId);
    if (!pos) {
      return ZeroPoint;
    }
    if (selectedJointIds.indexOf(jointId) !== -1) {
      pos = pointAdd(pos, offset!);
    }
    return pos;
  }

  function getSegmentGhostLine(segment: WireSegment): [Point, Point] | null {
    switch (segment.type) {
      case "output":
        return [
          elementPinPositionFromElementPinSelector(
            state,
            segment.outputPin.elementId,
            segment.outputPin.pinId
          ),
          getJointPosition(segment.jointId),
        ];
      case "input":
        return [
          getJointPosition(segment.jointId),
          elementPinPositionFromElementPinSelector(
            state,
            segment.inputPin.elementId,
            segment.inputPin.pinId
          ),
        ];
      case "bridge":
        return [
          getJointPosition(segment.jointAId),
          getJointPosition(segment.jointBId),
        ];
    }

    return null;
  }

  const ghostLines: [Point, Point][] = [];
  const visitedSegments = new Set<string>();
  for (const jointId of selectedJointIds) {
    const segmentIds = segmentIdsForJointIdSelector(state, jointId);
    for (const segmentId of segmentIds) {
      if (visitedSegments.has(segmentId)) {
        continue;
      }
      visitedSegments.add(segmentId);
      const ghostLine = getSegmentGhostLine(
        state.services.circuitGraph.wireSegmentsById[segmentId]
      );
      if (!ghostLine) {
        continue;
      }
      ghostLines.push(ghostLine);
    }
  }

  return ghostLines;
};
