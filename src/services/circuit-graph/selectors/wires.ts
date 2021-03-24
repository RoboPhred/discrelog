import { createSelector } from "reselect";
import values from "lodash/values";
import flatMap from "lodash/flatMap";
import uniq from "lodash/uniq";

import { CircuitGraphServiceState } from "../state";
import { createCircuitGraphSelector } from "../utils";
import { elementPinEquals, WireSegment, wireSegmentHasInput } from "../types";

const EmptyStringArray = Object.freeze([] as string[]);

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

export const wireSegmentIdsFromWireIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, wireId: string) => {
    const wire = s.wiresByWireId[wireId];
    if (!wire) {
      return EmptyStringArray;
    }
    return wire.wireSegmentIds;
  }
);

// TODO: cache busting
const jointIdsByWireIdCache = new Map<
  string,
  { segmentIds: string[]; jointIds: string[] }
>();
function getSegmentJoints(segment: WireSegment): string[] {
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

export const wireJointIdsFromWireIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, wireId: string) => {
    const wire = s.wiresByWireId[wireId];
    if (!wire) {
      return EmptyStringArray;
    }
    const segmentIds = wire.wireSegmentIds;
    const cached = jointIdsByWireIdCache.get(wireId);

    if (!cached || cached.segmentIds !== segmentIds) {
      let jointIds = flatMap(segmentIds, (segmentId) =>
        getSegmentJoints(s.wireSegmentsById[segmentId])
      );
      jointIds = uniq(jointIds);
      jointIdsByWireIdCache.set(wireId, { segmentIds, jointIds });
      return jointIds;
    }

    return cached.jointIds;
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

export const circuitIdForWireIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, wireId: string) => {
    for (const circuitId of Object.keys(s.wireIdsByCircuitId)) {
      if (s.wireIdsByCircuitId[circuitId].indexOf(wireId) !== -1) {
        return circuitId;
      }
    }

    return null;
  }
);

/**
 * Gets a list of wire joint ids in a given circuit.
 * WARN: Not react safe.
 */
export const wireJointIdsFromCircuitIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, circuitId: string) => {
    const wireIds = s.wireIdsByCircuitId[circuitId];
    const jointIds = flatMap(
      wireIds,
      (wireId) => s.wiresByWireId[wireId].wireJointIds
    );
    return jointIds;
  }
);
