import { createSelector } from "reselect";
import values from "lodash/values";
import flatMap from "lodash/flatMap";
import uniq from "lodash/uniq";

import { CircuitGraphServiceState } from "../state";
import { createCircuitGraphSelector, getJointIdsFromSegment } from "../utils";
import { elementPinEquals, wireSegmentHasInput } from "../types";

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

export const wireIdFromWireSegmentIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, segmentId: string) => {
    for (const wireId of Object.keys(s.wiresByWireId)) {
      const { wireSegmentIds } = s.wiresByWireId[wireId];
      if (wireSegmentIds.indexOf(segmentId) !== -1) {
        return wireId;
      }
    }
    return null;
  }
);

export const wireJointIdsFromWireIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, wireId: string) => {
    const wire = s.wiresByWireId[wireId];
    if (!wire) {
      return EmptyStringArray;
    }

    return wire.wireJointIds;
  }
);

export const wireIdFromWireJointIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, jointId: string) => {
    for (const wireId of Object.keys(s.wiresByWireId)) {
      const { wireJointIds } = s.wiresByWireId[wireId];
      if (wireJointIds.indexOf(jointId) !== -1) {
        return wireId;
      }
    }
    return null;
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
      return getJointIdsFromSegment(segment);
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

export const wireIdsFromCircuitIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, circuitId: string) => {
    return s.wireIdsByCircuitId[circuitId] ?? EmptyStringArray;
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
