import { AppState } from "@/store";
import { v4 as uuidV4 } from "uuid";
import { pinDirectionFromElementPinSelector } from "../../selectors/pins";
import {
  pinIsWiredSelector,
  wireIdFromWireJointIdSelector,
} from "../../selectors/wires";

import { CircuitGraphServiceState } from "../../state";
import { ElementPin, WireSegment } from "../../types";

import { collectWireLineIds } from "./utils";

export default function wireConnectPin(
  state: CircuitGraphServiceState,
  jointId: string,
  pin: ElementPin,
  lineId: string | null,
  rootState: AppState
): CircuitGraphServiceState | null {
  const wireId = wireIdFromWireJointIdSelector.local(state, jointId);
  if (!wireId) {
    return null;
  }

  if (!lineId) {
    lineId = defaultLineIdFromWiredPin(rootState, wireId, pin);
  }

  const direction = pinDirectionFromElementPinSelector(
    rootState,
    pin.elementId,
    pin.pinId
  );
  if (!direction) {
    return null;
  }

  if (
    direction === "input" &&
    pinIsWiredSelector(rootState, pin.elementId, pin.pinId)
  ) {
    return null;
  }

  const pinSegmentId = uuidV4();
  let pinSegment: WireSegment;

  if (direction === "input") {
    pinSegment = {
      type: "input",
      inputPin: pin,
      lineId,
      jointId,
    };
  } else {
    pinSegment = {
      type: "output",
      outputPin: pin,
      lineId,
      jointId,
    };
  }

  const wireSegmentsById: typeof state.wireSegmentsById = {
    ...state.wireSegmentsById,
    [pinSegmentId]: pinSegment,
  };

  // Add the segment ids to the wire.
  const wire = state.wiresByWireId[wireId];
  const wiresByWireId: typeof state.wiresByWireId = {
    ...state.wiresByWireId,
    [wireId]: {
      ...wire,
      wireSegmentIds: [...wire.wireSegmentIds, pinSegmentId],
    },
  };

  // Segment is from an existing wire so we do not need to set the circuit id for the wire.

  return {
    ...state,
    wireSegmentsById,
    wiresByWireId,
  };
}

function defaultLineIdFromWiredPin(
  state: AppState,
  wireId: string,
  pin: ElementPin
) {
  let lineId: string;

  const direction = pinDirectionFromElementPinSelector(
    state,
    pin.elementId,
    pin.pinId
  );

  const [inputLineIds, outputLineIds] = collectWireLineIds(
    state.services.circuitGraph,
    wireId
  );

  if (direction === "output" && outputLineIds.length > 0) {
    // Already have an output connected, create a new line for this one.
    lineId = uuidV4();
  } else if (
    (inputLineIds.length === 1 && outputLineIds.length === 0) ||
    (inputLineIds.length === 0 && outputLineIds.length === 1) ||
    (inputLineIds.length === 1 &&
      outputLineIds.length === 1 &&
      inputLineIds[0] === outputLineIds[0])
  ) {
    // If we only have one input or output, use that.
    lineId = inputLineIds[0] ?? outputLineIds[0];
  } else {
    lineId = uuidV4();
  }

  return lineId;
}
