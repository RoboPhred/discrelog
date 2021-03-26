import { wireIdFromWireJointIdSelector } from "../../selectors/wires";
import { CircuitGraphServiceState } from "../../state";

import { addSegment, wireMerge } from "./utils";

export default function wireBridgeJoints(
  state: CircuitGraphServiceState,
  joint1Id: string,
  joint2Id: string
): CircuitGraphServiceState {
  const wire1Id = wireIdFromWireJointIdSelector.local(state, joint1Id);
  const wire2Id = wireIdFromWireJointIdSelector.local(state, joint2Id);
  if (!wire1Id || !wire2Id || wire1Id === wire2Id) {
    return state;
  }

  const wire1 = state.wiresByWireId[wire1Id];
  const wire2 = state.wiresByWireId[wire2Id];
  if (!wire1 || !wire2) {
    return state;
  }

  if (
    wire1.wireJointIds.indexOf(joint1Id) === -1 ||
    wire2.wireJointIds.indexOf(joint2Id) === -1
  ) {
    return state;
  }

  // Merge the second wire into the first one.
  const mergedState = wireMerge(state, wire1Id, wire2Id);
  if (!mergedState) {
    return state;
  }
  state = mergedState;

  // Create a bridge between the two joints.
  state = addSegment(state, wire1Id, {
    type: "bridge",
    jointAId: joint1Id,
    jointBId: joint2Id,
  });

  return state;
}
