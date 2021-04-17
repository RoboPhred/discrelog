import values from "lodash/values";

import { isTruthy } from "@/utils";

import { CircuitGraphServiceState } from "../state";
import {
  isInputOutputWireSegment,
  isInputWireSegment,
  isOutputWireSegment,
} from "../types";
import { collectWireLineIds, createCircuitGraphSelector } from "../utils";

import { wireIdFromWireSegmentIdSelector } from "./wires";
import { elementNameOrDefaultFromElementIdSelector } from "./elements";

export interface WireLineCandidate {
  name: string;
  lineId: string;
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
          const elementId = outputElementIdFromLineId(state, lineId);
          if (!elementId) {
            return null;
          }
          const elementName = elementNameOrDefaultFromElementIdSelector.local(
            state,
            elementId
          );
          return {
            name: `From ${elementName}`,
            lineId,
          };
        })
        .filter(isTruthy);
    } else {
      return inputLineIds
        .filter((lineId) => !lineHasOutput(state, lineId))
        .map((lineId) => {
          const inputIds = inputElementIdsFromLineId(state, lineId);
          if (inputIds.length === 0) {
            return null;
          }
          const firstElementName = elementNameOrDefaultFromElementIdSelector.local(
            state,
            inputIds[0]
          );
          let name = `To ${firstElementName}`;
          if (inputIds.length > 1) {
            name += `(+${inputIds.length - 1})`;
          }
          return {
            name,
            lineId,
          };
        })
        .filter(isTruthy);
    }
  }
);

function outputElementIdFromLineId(
  state: CircuitGraphServiceState,
  lineId: string
): string | null {
  for (const segment of values(state.wireSegmentsById)) {
    if (!isOutputWireSegment(segment) || segment.lineId !== lineId) {
      continue;
    }
    return segment.outputPin.elementId;
  }

  return null;
}

function inputElementIdsFromLineId(
  state: CircuitGraphServiceState,
  lineId: string
): string[] {
  const inputIds: string[] = [];
  for (const segment of values(state.wireSegmentsById)) {
    if (!isInputWireSegment(segment) || segment.lineId !== lineId) {
      continue;
    }
    inputIds.push(segment.inputPin.elementId);
  }

  return inputIds;
}

function lineHasOutput(
  state: CircuitGraphServiceState,
  lineId: string
): boolean {
  for (const segment of values(state.wireSegmentsById)) {
    if (isOutputWireSegment(segment) && segment.lineId === lineId) {
      return true;
    }
  }

  return false;
}
