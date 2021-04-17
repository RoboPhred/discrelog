import { createSelector } from "reselect";
import values from "lodash/values";
import flatMap from "lodash/flatMap";
import uniq from "lodash/uniq";
import find from "lodash/find";

import { AppState } from "@/store";

import { immutableEmptyArray } from "@/arrays";

import { elementOutputFromCircuitElementPinSelector } from "@/services/simulator/selectors/elements";

import { CircuitGraphServiceState } from "../state";
import { createCircuitGraphSelector, getJointIdsFromSegment } from "../utils";
import {
  ElementPin,
  elementPinEquals,
  isOutputWireSegment,
  wireSegmentHasInput,
} from "../types";
import { elementTypeFromElementIdSelector } from "./elements";
import { elementTypeToCircuitId } from "@/elements/definitions/integrated-circuits/utils";

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

export const inputPinIsWiredSelector = createCircuitGraphSelector(
  (state: CircuitGraphServiceState, elementId: string, pinId: string) => {
    const wireIds = Object.keys(state.wiresByWireId);

    for (const wireId of wireIds) {
      const wire = state.wiresByWireId[wireId];
      for (const segmentId of wire.wireSegmentIds) {
        const segment = state.wireSegmentsById[segmentId];
        if (!wireSegmentHasInput(segment)) {
          continue;
        }
        if (elementPinEquals(segment.inputPin, { elementId, pinId })) {
          return true;
        }
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
      return getPoweredStateFromOutputPin(
        state,
        elementIdPath,
        segment.outputPin
      );
    }
    case "input": {
      const outputPin = getOutputPinForLineId(
        state,
        wireSegmentId,
        segment.lineId
      );
      if (!outputPin) {
        return false;
      }
      return getPoweredStateFromOutputPin(state, elementIdPath, outputPin);
    }
    case "bridge":
      // TODO: Figure out if any active line ids are crossing this bridge.
      return false;
  }

  return false;
};

function getPoweredStateFromOutputPin(
  state: AppState,
  elementIdPath: string[],
  elementPin: ElementPin
): boolean {
  const resolved = resolveOutputPin(state, elementIdPath, elementPin);
  if (!resolved) {
    return false;
  }
  return elementOutputFromCircuitElementPinSelector(
    state,
    [...resolved.elementIdPath, resolved.elementPin.elementId],
    resolved.elementPin.pinId
  );
}

function resolveOutputPin(
  state: AppState,
  elementIdPath: string[],
  elementPin: ElementPin
): { elementIdPath: string[]; elementPin: ElementPin } | null {
  // TODO: If target is a pin, keep chasing through the pins until we find the real element
  // the pin is sourcing from.
  const elementType = elementTypeFromElementIdSelector(
    state,
    elementPin.elementId
  );

  if (elementType === "pin-input") {
    // We are wired to an input pin inside an ic, track down the element outside the ic that powers us.
    const icId = elementIdPath[elementIdPath.length - 1];
    const icPath = elementIdPath.slice(0, elementIdPath.length - 1);
    // ic pin is the same id as the pin element.
    const outputPin = getOutputPinForInputPin(state, {
      elementId: icId,
      pinId: elementPin.elementId,
    });
    if (!outputPin) {
      return null;
    }
    return resolveOutputPin(state, icPath, outputPin);
  }

  const icCircuit = elementTypeToCircuitId(elementType);
  if (icCircuit != null) {
    // We are wired to an IC, enter the ic and track the output.
    const icPath = [...elementIdPath, elementPin.elementId];
    const inputPin: ElementPin = {
      // element id of the pin element will be the pin id of the ic.
      elementId: elementPin.pinId,
      pinId: "IN",
    };
    const outputPin = getOutputPinForInputPin(state, inputPin);
    if (!outputPin) {
      return null;
    }
    return resolveOutputPin(state, icPath, outputPin);
  }
  return { elementIdPath, elementPin };
}

function getOutputPinForLineId(
  state: AppState,
  segmentId: string,
  lineId: string
): ElementPin | null {
  const wire = find(
    values(state.services.circuitGraph.wiresByWireId),
    (wire) => wire.wireSegmentIds.indexOf(segmentId) !== -1
  );
  if (!wire) {
    return null;
  }
  for (const segmentId of wire.wireSegmentIds) {
    const segment = state.services.circuitGraph.wireSegmentsById[segmentId];
    if (!isOutputWireSegment(segment) || segment.lineId !== lineId) {
      continue;
    }
    return segment.outputPin;
  }

  return null;
}

function getOutputPinForInputPin(
  state: AppState,
  elementPin: ElementPin
): ElementPin | null {
  const { wiresByWireId, wireSegmentsById } = state.services.circuitGraph;
  const wireIds = Object.keys(wiresByWireId);
  for (const wireId of wireIds) {
    const wire = wiresByWireId[wireId];
    for (const segmentId of wire.wireSegmentIds) {
      const segment = wireSegmentsById[segmentId];
      if (!wireSegmentHasInput(segment)) {
        continue;
      }
      if (elementPinEquals(segment.inputPin, elementPin)) {
        if (segment.type === "input-output") {
          return segment.outputPin;
        } else {
          const outputSegment = find(
            wire.wireSegmentIds
              .map((id) => wireSegmentsById[id])
              .filter(isOutputWireSegment),
            (search) => segment.lineId === search.lineId
          );
          if (!outputSegment) {
            return null;
          }
          return outputSegment.outputPin;
        }
      }
    }
  }

  return null;
}
