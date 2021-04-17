import values from "lodash/values";

import { isTruthy } from "@/utils";

import { CircuitGraphServiceState } from "../state";
import {
  ElementPin,
  isInputOutputWireSegment,
  isInputWireSegment,
  isOutputWireSegment,
  WireSegment,
} from "../types";
import { collectWireLineIds, createCircuitGraphSelector } from "../utils";

import { wireIdFromWireSegmentIdSelector } from "./wires";
import { elementNameOrDefaultFromElementIdSelector } from "./elements";
import { pinNameFromElementPinSelector } from "./pins";

export interface WireLineCandidate {
  name: string;
  lineId: string;
  selected: boolean;
}

export const wireLineCandidatesForSegmentId = createCircuitGraphSelector(
  (state: CircuitGraphServiceState, segmentId: string) => {
    const segment = state.wireSegmentsById[segmentId];
    if (!segment || isInputOutputWireSegment(segment)) {
      return [];
    }

    const wireId = wireIdFromWireSegmentIdSelector.local(state, segmentId);
    if (!wireId) {
      return [];
    }

    const [inputLineIds, outputLineIds] = collectWireLineIds(state, wireId);

    if (isInputWireSegment(segment)) {
      return outputLineIds
        .map((lineId) => {
          const elementPin = outputElementPinFromLineId(state, lineId);
          if (!elementPin) {
            return null;
          }
          const elementName = elementNameOrDefaultFromElementIdSelector.local(
            state,
            elementPin.elementId
          );
          const pinName = pinNameFromElementPinSelector.local(
            state,
            elementPin.elementId,
            elementPin.pinId
          );
          return {
            name: `From [${elementName}]:[${pinName}]`,
            lineId,
            selected: lineId === segment.lineId,
          };
        })
        .filter(isTruthy);
    } else if (isOutputWireSegment(segment)) {
      return inputLineIds
        .filter((lineId) => !lineHasOutput(state, lineId, segment))
        .map((lineId) => {
          const inputPins = inputElementPinsFromLineId(state, lineId);
          if (inputPins.length === 0) {
            return null;
          }
          const firstElementName = elementNameOrDefaultFromElementIdSelector.local(
            state,
            inputPins[0].elementId
          );
          const firstPinName = pinNameFromElementPinSelector.local(
            state,
            inputPins[0].elementId,
            inputPins[0].pinId
          );
          let name = `To [${firstElementName}]:[${firstPinName}]`;
          if (inputPins.length > 1) {
            name += `(+${inputPins.length - 1})`;
          }
          return {
            name,
            lineId,
            selected: lineId === segment.lineId,
          };
        })
        .filter(isTruthy);
    }

    return [];
  }
);

function outputElementPinFromLineId(
  state: CircuitGraphServiceState,
  lineId: string
): ElementPin | null {
  for (const segment of values(state.wireSegmentsById)) {
    if (!isOutputWireSegment(segment) || segment.lineId !== lineId) {
      continue;
    }
    return segment.outputPin;
  }

  return null;
}

function inputElementPinsFromLineId(
  state: CircuitGraphServiceState,
  lineId: string
): ElementPin[] {
  const inputPins: ElementPin[] = [];
  for (const segment of values(state.wireSegmentsById)) {
    if (!isInputWireSegment(segment) || segment.lineId !== lineId) {
      continue;
    }
    inputPins.push(segment.inputPin);
  }

  return inputPins;
}

function lineHasOutput(
  state: CircuitGraphServiceState,
  lineId: string,
  excludeSegment?: WireSegment
): boolean {
  for (const segment of values(state.wireSegmentsById)) {
    if (excludeSegment === segment) {
      continue;
    }
    if (isOutputWireSegment(segment) && segment.lineId === lineId) {
      return true;
    }
  }

  return false;
}
