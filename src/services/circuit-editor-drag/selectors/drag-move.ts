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
import { immutableEmptyArray } from "@/arrays";

import {
  selectedElementIdsSelector,
  selectedJointIdsSelector,
} from "@/services/selection/selectors/selection";
import { segmentIdsForJointIdSelector } from "@/services/circuit-graph/selectors/wires";
import { ElementPin, WireSegment } from "@/services/circuit-graph/types";
import { elementPinPositionFromElementPinSelector } from "@/services/circuit-layout/selectors/element-pin-positions";
import {
  wireJointPositionByJointIdSelector,
  wireJointPositionFromJointIdSelector,
} from "@/services/circuit-graph/selectors/wire-positions";
import { elementPositionsByElementIdSelector } from "@/services/circuit-layout/selectors/element-positions";

import { gridElementSnapSelector, gridJointSnapSelector } from "./snap";

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

export const dragMoveElementPositionsByIdSelector = (state: AppState) => {
  const offset = dragMoveOffsetSelector(state);

  if (!offset) {
    return null;
  }

  const selectedElementIds = selectedElementIdsSelector(state);
  const elementPositionsById = elementPositionsByElementIdSelector(state);

  const dragMoveElementPositionsById: Record<string, Point> = {};
  for (const elementId of selectedElementIds) {
    dragMoveElementPositionsById[elementId] = pointAdd(
      elementPositionsById[elementId],
      offset
    );
  }
  return dragMoveElementPositionsById;
};

export const dragMoveJointPositionsByIdSelector = (state: AppState) => {
  const offset = dragMoveOffsetSelector(state);

  if (!offset) {
    return null;
  }

  const selectedJointIds = selectedJointIdsSelector(state);
  const JointPositionsById = wireJointPositionByJointIdSelector(state);

  const dragMoveJointPositionsById: Record<string, Point> = {};
  for (const jointId of selectedJointIds) {
    dragMoveJointPositionsById[jointId] = pointAdd(
      JointPositionsById[jointId],
      offset
    );
  }
  return dragMoveJointPositionsById;
};

export const dragMoveGhostLinesSelector = (
  state: AppState
): [start: Point, end: Point][] => {
  const dragService = state.services.circuitEditorDrag;
  if (dragService.dragMode !== "move") {
    return immutableEmptyArray<[Point, Point]>();
  }

  const selectedJointIds = selectedJointIdsSelector(state);
  const selectedElementIds = selectedElementIdsSelector(state);
  const offset = dragMoveOffsetSelector(state);
  if (!offset) {
    return immutableEmptyArray<[Point, Point]>();
  }

  function getPinPosition(pin: ElementPin): Point {
    let pos = elementPinPositionFromElementPinSelector(
      state,
      pin.elementId,
      pin.pinId
    );
    if (selectedElementIds.indexOf(pin.elementId) !== -1) {
      pos = pointAdd(pos, offset!);
    }
    return pos;
  }

  function getJointPosition(jointId: string): Point {
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
          getPinPosition(segment.outputPin),
          getJointPosition(segment.jointId),
        ];
      case "input":
        return [
          getJointPosition(segment.jointId),
          getPinPosition(segment.inputPin),
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
