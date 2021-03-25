import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

import { CircuitGraphServiceState } from "./state";
import { WireSegment } from "./types";

export const createCircuitGraphReducer = createServiceReducerCreator(
  "circuitGraph"
);
export const createCircuitGraphSelector = createServiceSelectorCreator(
  "circuitGraph"
);

export function getSegmentIdsFromJoint(
  state: CircuitGraphServiceState,
  wireId: string,
  jointId: string
): string[] {
  const wire = state.wiresByWireId[wireId];

  const jointedSegmentIds = new Set<string>();
  for (const segmentId of wire.wireSegmentIds) {
    const segment = state.wireSegmentsById[segmentId];
    switch (segment.type) {
      case "input":
      case "output":
        if (segment.jointId === jointId) jointedSegmentIds.add(segmentId);
        break;
      case "bridge":
        if (segment.jointAId === jointId || segment.jointBId === jointId)
          jointedSegmentIds.add(segmentId);
        break;
    }
  }

  return Array.from(jointedSegmentIds);
}

export function getJointIdsFromSegment(segment: WireSegment): string[] {
  switch (segment.type) {
    case "bridge":
      return [segment.jointAId, segment.jointBId];
    case "input":
    case "output":
      return [segment.jointId];
    default:
      return [];
  }
}
