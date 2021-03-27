import { v4 as uuidV4 } from "uuid";

import { AppState } from "@/store";

import { isWireConnectAction } from "@/actions/wire-connect";

import { ElementPin, WireConnectTarget, WireSegment } from "../types";
import { createCircuitGraphReducer } from "../utils";
import { CircuitGraphServiceState } from "../state";

import { circuitIdFromElementIdSelector } from "../selectors/elements";
import {
  circuitIdFromWireJointIdSelector,
  pinIsWiredSelector,
  wireIdFromWireJointIdSelector,
} from "../selectors/wires";
import { pinDirectionFromElementPinSelector } from "../selectors/pins";

import { wireCreate } from "./primitives/wire-create";
import { wireSegmentInsert } from "./primitives/wire-segment-insert";
import { wireJointInsert } from "./primitives/wire-joint-insert";
import wireSegmentSplit from "./primitives/wire-segment-split";
import { WireOperationError } from "./errors/WireOperationError";
import { wireMerge } from "./primitives/wire-merge";
import { collectWireLineIds } from "./primitives/wire-lineids-collect";

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
  } = targetToParts(state, circuitId, from, rootState);
  state = fromState;
  const fromCircuitId = fromPin
    ? circuitIdFromElementIdSelector.local(state, fromPin.elementId)
    : fromJointId
    ? circuitIdFromWireJointIdSelector.local(state, fromJointId)
    : null;

  const { state: toState, jointId: toJointId, pin: toPin } = targetToParts(
    state,
    circuitId,
    to,
    rootState
  );
  state = toState;
  const toCircuitId = toPin
    ? circuitIdFromElementIdSelector.local(state, toPin.elementId)
    : toJointId
    ? circuitIdFromWireJointIdSelector.local(state, toJointId)
    : null;

  if (!fromCircuitId || !toCircuitId || fromCircuitId !== toCircuitId) {
    return unchangedState;
  }

  // Pin to pin is a new wire with an input-output segment.
  if (fromPin && toPin) {
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
      return unchangedState;
    }

    const inputPin = fromDirection === "input" ? fromPin : toPin;
    const outputPin = fromDirection === "input" ? toPin : fromPin;

    // Input pins can only have one wire.
    if (pinIsWiredSelector(rootState, inputPin.elementId, inputPin.pinId)) {
      return unchangedState;
    }

    // Pin to pin, create a new wire.
    const wireId = uuidV4();
    state = wireCreate(state, fromCircuitId, wireId);
    state = wireSegmentInsert(state, wireId, uuidV4(), {
      type: "input-output",
      inputPin,
      outputPin,
    });
    return state;
  }

  // Joint to joint potentially bridges two wires.
  if (fromJointId && toJointId) {
    const fromWireId = wireIdFromWireJointIdSelector.local(state, fromJointId);
    const toWireId = wireIdFromWireJointIdSelector.local(state, toJointId);
    if (!fromWireId || !toWireId) {
      return unchangedState;
    }

    if (fromWireId !== toWireId) {
      const mergedState = wireMerge(state, fromWireId, toWireId);
      if (!mergedState) {
        return unchangedState;
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

  // At this point, we are going from a joint to a pin.
  {
    const jointId = fromJointId ?? toJointId;
    const pin = fromPin ?? toPin;
    if (!jointId || !pin) {
      return unchangedState;
    }

    const wireId = wireIdFromWireJointIdSelector.local(state, jointId);
    if (!wireId) {
      return unchangedState;
    }

    const direction = pinDirectionFromElementPinSelector(
      rootState,
      pin.elementId,
      pin.pinId
    );
    if (!direction) {
      return unchangedState;
    }

    const lineId = defaultLineIdFromWiredPin(rootState, wireId, pin);

    let segment: WireSegment;
    if (direction === "input") {
      if (pinIsWiredSelector(rootState, pin.elementId, pin.pinId)) {
        return unchangedState;
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
});

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

function targetToParts(
  state: CircuitGraphServiceState,
  circuitId: string,
  target: WireConnectTarget,
  rootState: AppState
): {
  state: CircuitGraphServiceState;
  jointId: string | null;
  pin: ElementPin | null;
} {
  switch (target.type) {
    case "pin":
      return { state, jointId: null, pin: target.pin };
    case "joint":
      return { state, jointId: target.jointId, pin: null };
    case "floating": {
      // Create a new wire to hold the point.
      // If this is to a pin, the wire will stand.
      // If this is to another wire, the wire will merge.
      const wireId = uuidV4();
      state = wireCreate(state, circuitId, wireId);
      const jointId = uuidV4();
      state = wireJointInsert(state, wireId, jointId, target.point);
      return { state, jointId, pin: null };
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
      return { state, jointId, pin: null };
    }
  }

  throw new WireOperationError("Unknown wire connect target");
}
