import findKey from "lodash/findKey";
import includes from "lodash/includes";

import { CircuitGraphServiceState } from "../../state";

import wireDelete from "./wire-delete";
import { removeSegment, wireSplit } from "./utils";

export default function wireSegmentDelete(
  state: CircuitGraphServiceState,
  wireSegmentId: string
): CircuitGraphServiceState {
  const removedSegment = state.wireSegmentsById[wireSegmentId];
  if (!removedSegment) {
    return state;
  }

  const wireId = findKey(state.wiresByWireId, (wire) =>
    includes(wire.wireSegmentIds, wireSegmentId)
  );
  if (!wireId) {
    return state;
  }

  if (
    removedSegment.type === "input-output" ||
    state.wiresByWireId[wireId].wireSegmentIds.length === 1
  ) {
    // Removing this segment will remove the entire wire.
    return wireDelete(state, wireId);
  }

  if (removedSegment.type === "bridge") {
    // Remove the bridge.
    state = removeSegment(state, wireId, wireSegmentId, true);

    // Check if we cut the wire into two networks.
    // We can tell because removeSegment will delete orphaned joints, and
    // if both joints werent removed then other parts of the wire network still exist
    // at both ends.
    const wire = state.wiresByWireId[wireId]!;
    const { jointAId, jointBId } = removedSegment;
    if (
      wire &&
      wire.wireJointIds.indexOf(jointAId) !== -1 &&
      wire.wireJointIds.indexOf(jointBId) !== -1
    ) {
      const splitState = wireSplit(state, wireId, removedSegment.jointBId);
      if (splitState) {
        state = splitState;
      }
    }

    return state;
  }

  // At this point, the segment is a connection from an element pin to the rest of the wire.
  // There are no joints to delete, as the single joint will be used by the other wire segment.
  return removeSegment(state, wireId, wireSegmentId);
}
