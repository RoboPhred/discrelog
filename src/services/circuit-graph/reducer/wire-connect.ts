import { v4 as uuidV4 } from "uuid";

import { AppState } from "@/store";

import { isWireConnectAction } from "@/actions/wire-connect";

import { ElementPin, WireConnectTarget, WireSegment } from "../types";
import { createCircuitGraphReducer, collectWireLineIds } from "../utils";
import { CircuitGraphServiceState } from "../state";

import { circuitIdFromElementIdSelector } from "../selectors/elements";
import {
  circuitIdFromWireJointIdSelector,
  inputPinIsWiredSelector,
  wireIdFromWireJointIdSelector,
} from "../selectors/wires";
import { pinDirectionFromElementPinSelector } from "../selectors/pins";

import { wireCreate } from "./primitives/wire-create";
import { wireSegmentInsert } from "./primitives/wire-segment-insert";
import { wireJointInsert } from "./primitives/wire-joint-insert";
import wireSegmentSplit from "./primitives/wire-segment-split";
import { WireOperationError } from "./errors/WireOperationError";
import { wireMerge } from "./primitives/wire-merge";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isWireConnectAction(action)) {
    return state;
  }

  const unchangedState = state;

  const { circuitId, from, to } = action.payload;

  const {
    state: fromState,
    jointId: fromJointId,
    pin: fromPin,
    circuitId: fromCircuitId,
  } = targetToParts(state, circuitId, from, rootState);
  state = fromState;

  const {
    state: toState,
    jointId: toJointId,
    pin: toPin,
    circuitId: toCircuitId,
  } = targetToParts(state, circuitId, to, rootState);
  state = toState;

  if (!fromCircuitId || !toCircuitId || fromCircuitId !== toCircuitId) {
    return unchangedState;
  }

  // Pin to pin is a new wire with an input-output segment.
  if (fromPin && toPin) {
    const newState = wirePins(state, fromPin, toPin, fromCircuitId, rootState);
    return newState ?? unchangedState;
  }

  // Joint to joint potentially bridges two wires.
  if (fromJointId && toJointId) {
    const newState = wireJoints(state, fromJointId, toJointId);
    return newState ?? unchangedState;
  }

  // At this point, we are going from a joint to a pin.
  const jointId = fromJointId ?? toJointId;
  const pin = fromPin ?? toPin;
  if (jointId && pin) {
    const newState = wireJointToPin(state, jointId, pin, rootState);
    return newState ?? unchangedState;
  }

  return unchangedState;
});

function wirePins(
  state: CircuitGraphServiceState,
  fromPin: ElementPin,
  toPin: ElementPin,
  circuitId: string,
  rootState: AppState
): CircuitGraphServiceState | null {
  const fromDirection = pinDirectionFromElementPinSelector(
    rootState,
    fromPin.elementId,
    fromPin.pinId
  );
  const toDirection = pinDirectionFromElementPinSelector(
    rootState,
    toPin.elementId,
    toPin.pinId
  );

  if (!fromDirection || !toDirection || fromDirection === toDirection) {
    return null;
  }

  const inputPin = fromDirection === "input" ? fromPin : toPin;
  const outputPin = fromDirection === "input" ? toPin : fromPin;

  // Input pins can only have one wire.
  if (inputPinIsWiredSelector(rootState, inputPin.elementId, inputPin.pinId)) {
    return null;
  }

  // Pin to pin, create a new wire.
  const wireId = uuidV4();
  state = wireCreate(state, circuitId, wireId);
  state = wireSegmentInsert(state, wireId, uuidV4(), {
    type: "input-output",
    inputPin,
    outputPin,
  });
  return state;
}

function wireJoints(
  state: CircuitGraphServiceState,
  fromJointId: string,
  toJointId: string
): CircuitGraphServiceState | null {
  const fromWireId = wireIdFromWireJointIdSelector.local(state, fromJointId);
  const toWireId = wireIdFromWireJointIdSelector.local(state, toJointId);
  if (!fromWireId || !toWireId) {
    return null;
  }

  if (fromWireId !== toWireId) {
    const mergedState = wireMerge(state, fromWireId, toWireId);
    if (!mergedState) {
      return null;
    }
    state = mergedState;
  }

  state = wireSegmentInsert(state, fromWireId, uuidV4(), {
    type: "bridge",
    jointAId: fromJointId,
    jointBId: toJointId,
  });
  return state;
}

function wireJointToPin(
  state: CircuitGraphServiceState,
  jointId: string,
  pin: ElementPin,
  rootState: AppState
): CircuitGraphServiceState | null {
  const wireId = wireIdFromWireJointIdSelector.local(state, jointId);
  if (!wireId) {
    return null;
  }

  const direction = pinDirectionFromElementPinSelector(
    rootState,
    pin.elementId,
    pin.pinId
  );
  if (!direction) {
    return null;
  }

  const lineId = defaultLineIdFromWiredPin(state, wireId, pin, rootState);

  let segment: WireSegment;
  if (direction === "input") {
    if (inputPinIsWiredSelector(rootState, pin.elementId, pin.pinId)) {
      return null;
    }

    segment = {
      type: "input",
      inputPin: pin,
      jointId,
      lineId,
    };
  } else if (direction === "output") {
    segment = {
      type: "output",
      outputPin: pin,
      jointId,
      lineId,
    };
  } else {
    throw new WireOperationError("Unknown pin direction");
  }

  state = wireSegmentInsert(state, wireId, uuidV4(), segment);
  return state;
}

function defaultLineIdFromWiredPin(
  state: CircuitGraphServiceState,
  wireId: string,
  pin: ElementPin,
  rootState: AppState
): string {
  const direction = pinDirectionFromElementPinSelector(
    rootState,
    pin.elementId,
    pin.pinId
  );

  const [inputLineIds, outputLineIds] = collectWireLineIds(state, wireId);

  if (direction === "output" && outputLineIds.length > 0) {
    // Already have an output connected, create a new line for this one.
    return uuidV4();
  } else if (
    (inputLineIds.length === 1 && outputLineIds.length === 0) ||
    (inputLineIds.length === 0 && outputLineIds.length === 1) ||
    (inputLineIds.length === 1 &&
      outputLineIds.length === 1 &&
      inputLineIds[0] === outputLineIds[0])
  ) {
    // If we only have one input or output, use that.
    return inputLineIds[0] ?? outputLineIds[0];
  }

  // Multiple outputs are available.
  // Make a new line
  return uuidV4();
}

function targetToParts(
  state: CircuitGraphServiceState,
  circuitId: string,
  target: WireConnectTarget,
  rootState: AppState
): {
  state: CircuitGraphServiceState;
  jointId: string | null;
  pin: ElementPin | null;
  circuitId: string | null;
} {
  switch (target.type) {
    case "pin":
      return {
        state,
        jointId: null,
        pin: target.pin,
        circuitId: circuitIdFromElementIdSelector.local(
          state,
          target.pin.elementId
        ),
      };
    case "joint":
      return {
        state,
        jointId: target.jointId,
        pin: null,
        circuitId: circuitIdFromWireJointIdSelector.local(
          state,
          target.jointId
        ),
      };
    case "floating": {
      // Create a new wire to hold the point.
      // If this is to a pin, the wire will stand.
      // If this is to another wire, the wire will merge.
      const wireId = uuidV4();
      state = wireCreate(state, circuitId, wireId);
      const jointId = uuidV4();
      state = wireJointInsert(state, wireId, jointId, target.point);
      return { state, jointId, pin: null, circuitId };
    }
    case "segment": {
      const jointId = uuidV4();
      state = wireSegmentSplit(
        state,
        target.segmentId,
        target.segmentInsertLength,
        jointId,
        rootState
      );
      return { state, jointId, pin: null, circuitId };
    }
  }

  throw new WireOperationError("Unknown wire connect target");
}
