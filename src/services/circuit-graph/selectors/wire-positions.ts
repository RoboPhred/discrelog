import { ZeroPoint } from "@/geometry";

import { AppState } from "@/store";

import { elementPinPositionFromElementPinSelector } from "@/services/circuit-layout/selectors/element-pin-positions";

import { CircuitGraphServiceState } from "../state";
import { createCircuitGraphSelector } from "../utils";

import { wireSegmentByWireSegmentIdSelector } from "./wires";

export const wireJointPositionByJointIdSelector = createCircuitGraphSelector(
  (s) => s.wireJointPositionsByJointId
);

export const wireJointPositionFromJointIdSelector = createCircuitGraphSelector(
  (state: CircuitGraphServiceState, jointId: string) =>
    state.wireJointPositionsByJointId[jointId] ?? ZeroPoint
);

export const startPositionForWireSegmentId = (
  state: AppState,
  wireSegmentId: string
) => {
  const segment = wireSegmentByWireSegmentIdSelector(state, wireSegmentId);
  switch (segment.type) {
    case "output":
    case "input-output": {
      // Outputs start at the output and end at the joint.
      const { outputPin } = segment;
      return elementPinPositionFromElementPinSelector(
        state,
        outputPin.elementId,
        outputPin.pinId
      );
    }
    case "input": {
      // Inputs start at joint and end at input.
      const { jointId } = segment;
      return wireJointPositionFromJointIdSelector(state, jointId);
    }
    case "bridge": {
      const { jointAId } = segment;
      return wireJointPositionFromJointIdSelector(state, jointAId);
    }
  }
};

export const endPositionForWireSegmentId = (
  state: AppState,
  wireSegmentId: string
) => {
  const segment = wireSegmentByWireSegmentIdSelector(state, wireSegmentId);
  switch (segment.type) {
    case "output": {
      // Outputs start at the output and end at the joint.
      const { jointId } = segment;
      return wireJointPositionFromJointIdSelector(state, jointId);
    }
    case "input":
    case "input-output": {
      // Inputs start at joint and end at input.
      const { inputPin } = segment;
      return elementPinPositionFromElementPinSelector(
        state,
        inputPin.elementId,
        inputPin.pinId
      );
    }
    case "bridge": {
      const { jointBId } = segment;
      return wireJointPositionFromJointIdSelector(state, jointBId);
    }
  }
};
