import find from "lodash/find";

import { CircuitGraphServiceState } from "../../state";

import wireSegmentDelete from "./wire-segment-delete";

export default function wireJointDelete(
  state: CircuitGraphServiceState,
  jointId: string
): CircuitGraphServiceState {
  const wire = find(
    state.wiresByWireId,
    (wire) => wire.wireJointIds.indexOf(jointId) !== -1
  );
  if (!wire) {
    return state;
  }

  const deleteSegmentIds: string[] = [];
  for (const segmentId of wire.wireSegmentIds) {
    const segment = state.wireSegmentsById[segmentId];
    switch (segment.type) {
      case "input":
      case "output":
        if (segment.jointId === jointId) deleteSegmentIds.push(segmentId);
        break;
      case "bridge":
        if (segment.jointAId === jointId || segment.jointBId === jointId)
          deleteSegmentIds.push(segmentId);
        break;
    }
  }

  state = deleteSegmentIds.reduce(
    (state, segmentId) => wireSegmentDelete(state, segmentId),
    state
  );

  return state;
}
