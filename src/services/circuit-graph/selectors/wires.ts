import { createSelector } from "reselect";
import values from "lodash/values";
import flatMap from "lodash/flatMap";
import uniq from "lodash/uniq";

import { CircuitGraphServiceState } from "../state";
import { createCircuitGraphSelector } from "../utils";
import { elementPinEquals, wireSegmentHasInput } from "../types";

export const wiresByWireIdSelector = createCircuitGraphSelector(
  (state) => state.wiresByWireId
);
export const wireIdsSelector = createSelector(
  wiresByWireIdSelector,
  (wiresByWireId) => Object.keys(wiresByWireId)
);

export const wireSegmentsByWireSegmentIdSelector = createCircuitGraphSelector(
  (state) => state.wireSegmentsById
);

export const wireSegmentsSelector = createCircuitGraphSelector(
  createSelector(
    wireSegmentsByWireSegmentIdSelector.local,
    (segmentsBySegmentId) => values(segmentsBySegmentId)
  )
);

const EmptyWireSegmentIds = Object.freeze([] as string[]);
export const wireSegmentIdsFromWireIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, wireId: string) => {
    const wire = s.wiresByWireId[wireId];
    if (!wire) {
      return EmptyWireSegmentIds;
    }
    return wire.wireSegmentIds;
  }
);

export const wireSegmentTypeFromSegmentIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, segmentId: string) => {
    const segment = s.wireSegmentsById[segmentId];
    if (!segment) {
      return null;
    }
    return segment.type;
  }
);

export const wireJointIdsByWireIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, wireId: string) => {
    const segmentIds = wireSegmentIdsFromWireIdSelector.local(s, wireId);
    const jointIds = flatMap(segmentIds, (segmentId) => {
      const segment = wireSegmentByWireSegmentIdSelector.local(s, segmentId);
      switch (segment.type) {
        case "bridge":
          return [segment.jointAId, segment.jointBId];
        case "input":
          return [segment.jointId];
        case "output":
          return [segment.jointId];
        default:
          return [];
      }
    });

    return uniq(jointIds);
  }
);

export const wireSegmentByWireSegmentIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, wireSegmentId: string) => {
    return s.wireSegmentsById[wireSegmentId] ?? null;
  }
);

export const pinIsWiredSelector = createCircuitGraphSelector(
  (state: CircuitGraphServiceState, elementId: string, pinId: string) => {
    const segments = wireSegmentsSelector.local(state);

    for (const { inputPin } of segments.filter(wireSegmentHasInput)) {
      if (elementPinEquals(inputPin, { elementId, pinId })) {
        return true;
      }
    }

    return false;
  }
);
