import pick from "lodash/pick";
import findKey from "lodash/findKey";
import includes from "lodash/includes";
import mapValues from "lodash/mapValues";

import { CircuitGraphServiceState } from "../../state";

import wireDelete from "./wire-delete";
import wireSplit from "./wire-split";
import { getSegmentJoints } from "../../utils";
import { removeSegment } from "./utils";

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

  if (removedSegment.type === "input-output") {
    // Remove the whole wire.
    return wireDelete(state, wireId);
  } else if (removedSegment.type === "bridge") {
    // Remove the bridge.
    state = removeSegment(state, wireId, wireSegmentId);

    // If both joints are remaining in the wire, split off one of them into a new wire
    const wire = state.wiresByWireId[wireId]!;
    const { jointAId, jointBId } = removedSegment;
    if (
      wire &&
      wire.wireJointIds.indexOf(jointAId) !== -1 &&
      wire.wireJointIds.indexOf(jointBId) !== -1
    ) {
      state = wireSplit(state, wireId, removedSegment.jointBId);
    }

    return state;
  }

  if (state.wiresByWireId[wireId].wireSegmentIds.length === 1) {
    // Removing this segment will remove the entire wire
    return wireDelete(state, wireId);
  }

  // At this point, the segment is a connection from an element pin to the rest of the wire.
  // There are no joints to delete, as the single joint will be used by the other wire segment.
  return removeSegment(state, wireId, wireSegmentId);
}
