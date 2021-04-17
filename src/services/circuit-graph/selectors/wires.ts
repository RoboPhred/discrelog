import { createSelector } from "reselect";
import values from "lodash/values";
import flatMap from "lodash/flatMap";
import uniq from "lodash/uniq";

import { AppState } from "@/store";

import { immutableEmptyArray } from "@/arrays";

import { elementOutputFromCircuitElementPinSelector } from "@/services/simulator/selectors/elements";

import { CircuitGraphServiceState } from "../state";
import { createCircuitGraphSelector, getJointIdsFromSegment } from "../utils";
import { ElementPin, elementPinEquals, wireSegmentHasInput } from "../types";

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
      return immutableEmptyArray<string>();
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
      return immutableEmptyArray<string>();
    }

    return wire.wireJointIds;
  }
);

export const circuitIdFromWireJointIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, jointId: string) => {
    const wireId = wireIdFromWireJointIdSelector.local(s, jointId);
    if (!wireId) {
      return null;
    }

    for (const circuitId of Object.keys(s.wireIdsByCircuitId)) {
      if (s.wireIdsByCircuitId[circuitId].indexOf(wireId) !== -1) {
        return circuitId;
      }
    }

    return null;
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
    return s.wireIdsByCircuitId[circuitId] ?? immutableEmptyArray<string>();
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

export const segmentIdsForJointIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, jointId: string) => {
    const wireId = wireIdFromWireJointIdSelector.local(s, jointId);
    if (!wireId) {
      return immutableEmptyArray<string>();
    }
    const wire = s.wiresByWireId[wireId];

    const segmentIds: string[] = [];
    for (const segmentId of wire.wireSegmentIds) {
      const jointIds = getJointIdsFromSegment(s.wireSegmentsById[segmentId]);
      if (jointIds.indexOf(jointId) !== -1) {
        segmentIds.push(segmentId);
      }
    }
    return segmentIds;
  }
);

export const wireSegmentPoweredSelector = (
  state: AppState,
  elementIdPath: string[],
  wireSegmentId: string
) => {
  const segment = state.services.circuitGraph.wireSegmentsById[wireSegmentId];
  if (!segment) {
    return false;
  }

  switch (segment.type) {
    case "input-output":
    case "output": {
      const {
        elementPin: resolvedElementPin,
        elementIdPath: resolvedElementIdPath,
      } = resolveOutputPin(state, elementIdPath, segment.outputPin);
      return elementOutputFromCircuitElementPinSelector(
        state,
        [...resolvedElementIdPath, resolvedElementPin.elementId],
        resolvedElementPin.pinId
      );
    }
    case "input":
    // TODO: Find output for input and resolve value.
    case "bridge":
      // TODO: Figure out if any active line ids are crossing this bridge.
      return false;
  }

  return false;
};

function resolveOutputPin(
  state: AppState,
  elementIdPath: string[],
  elementPin: ElementPin
): { elementIdPath: string[]; elementPin: ElementPin } {
  // TODO: If target is a pin, keep chasing through the pins until we find the real element
  // the pin is sourcing from.
  return { elementIdPath, elementPin };
}
