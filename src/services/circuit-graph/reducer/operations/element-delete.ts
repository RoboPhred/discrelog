import pick from "lodash/pick";
import difference from "lodash/difference";
import includes from "lodash/includes";
import find from "lodash/find";
import flatMap from "lodash/flatMap";
import mapValues from "lodash/mapValues";

import { AppState } from "@/store";

import { CircuitGraphServiceState } from "../../state";
import { elementPinEquals, WireSegment } from "../../types";

import { elementPinsFromPinElementSelector } from "../../selectors/pins";
import { wireIdFromWireSegmentIdSelector } from "../../selectors/wires";

import wireSegmentDelete from "./wire-segment-delete";

export default function elementDelete(
  state: CircuitGraphServiceState,
  removedElementIds: string[],
  rootState: AppState
): CircuitGraphServiceState {
  const remainingElementIds = difference(
    Object.keys(state.elementsById),
    removedElementIds
  );

  const elementIdsByCircuitId = mapValues(
    state.elementIdsByCircuitId,
    (circuitElementIds) => difference(circuitElementIds, removedElementIds)
  );

  state = {
    ...state,
    elementsById: pick(state.elementsById, remainingElementIds),
    elementIdsByCircuitId,
  };

  // Remove wires targeting these elements.
  const removedIcPins = flatMap(removedElementIds, (elementId) =>
    elementPinsFromPinElementSelector(rootState, elementId)
  );

  function isSegmentForRemovedElement(segment: WireSegment) {
    switch (segment.type) {
      case "input-output":
        return (
          includes(removedElementIds, segment.inputPin.elementId) ||
          includes(removedElementIds, segment.outputPin.elementId)
        );
      case "input":
        return includes(removedElementIds, segment.inputPin.elementId);
      case "output":
        return includes(removedElementIds, segment.outputPin.elementId);
    }
    return false;
  }

  function isSegmentForRemovedPin(segment: WireSegment) {
    switch (segment.type) {
      case "input-output":
        return Boolean(
          find(removedIcPins, (removedPin) =>
            elementPinEquals(removedPin, segment.inputPin)
          ) ||
            find(removedIcPins, (removedPin) =>
              elementPinEquals(removedPin, segment.outputPin)
            )
        );
      case "input":
        return Boolean(
          find(removedIcPins, (removedPin) =>
            elementPinEquals(removedPin, segment.inputPin)
          )
        );
      case "output":
        return Boolean(
          find(removedIcPins, (removedPin) =>
            elementPinEquals(removedPin, segment.outputPin)
          )
        );
    }
    return false;
  }

  const removedSegmentIds = Object.keys(state.wireSegmentsById).filter(
    (segmentId) => {
      const segment = state.wireSegmentsById[segmentId];
      return (
        isSegmentForRemovedElement(segment) || isSegmentForRemovedPin(segment)
      );
    }
  );

  state = removedSegmentIds.reduce((state, segmentId) => {
    const wireId = wireIdFromWireSegmentIdSelector.local(state, segmentId);
    if (!wireId) {
      return state;
    }
    return wireSegmentDelete(state, segmentId);
  }, state);

  return state;
}
