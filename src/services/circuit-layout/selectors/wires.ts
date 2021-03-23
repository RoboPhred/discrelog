import { ZeroPoint } from "@/geometry";
import { AppState } from "@/store";

import { wireSegmentByWireSegmentIdSelector } from "@/services/circuit-graph/selectors/wires";

import { CircuitLayoutServiceState } from "../state";
import { createCircuitLayoutSelector } from "../utils";

import { elementPinPositionFromElementPinSelector } from "./element-pin-positions";

export const wireJointPositionByJointIdSelector = createCircuitLayoutSelector(
  (s) => s.wireJointPositionsByJointId
);

export const wireJointPositionFromJointIdSelector = createCircuitLayoutSelector(
  (state: CircuitLayoutServiceState, jointId: string) =>
    state.wireJointPositionsByJointId[jointId] ?? ZeroPoint
);

export const startPositionByWireSegmentId = (
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

export const endPositionByWireSegmentId = (
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
