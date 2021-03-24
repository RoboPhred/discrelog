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

  const jointedSegmentIds = new Set<string>();
  for (const segmentId of wire.wireSegmentIds) {
    const segment = state.wireSegmentsById[segmentId];
    switch (segment.type) {
      case "input":
      case "output":
        if (segment.jointId === jointId) jointedSegmentIds.add(segmentId);
        break;
      case "bridge":
        if (segment.jointAId === jointId || segment.jointBId === jointId)
          jointedSegmentIds.add(segmentId);
        break;
    }
  }

  // if (jointedSegmentIds.length === 2) {
  //   const mergedState = mergeSegments(
  //     state,
  //     jointedSegmentIds[0],
  //     jointedSegmentIds[1],
  //     jointId
  //   );
  //   if (mergedState) {
  //     return mergedState;
  //   }
  // }

  state = Array.from(jointedSegmentIds).reduce(
    (state, segmentId) => wireSegmentDelete(state, segmentId),
    state
  );

  return state;
}

// function mergeSegments(
//   state: CircuitGraphServiceState,
//   segmentId1: string,
//   segmentId2: string,
//   jointId: string
// ): CircuitGraphServiceState | null {
//   const seg1 = state.wireSegmentsById[segmentId1];
//   const seg2 = state.wireSegmentsById[segmentId2];
//   if (!seg1 || !seg2) {
//     return null;
//   }

//   if (
//     (seg1.type === "input" || seg1.type === "output") &&
//     (seg2.type === "input" || seg2.type === "output") &&
//     seg1.type !== seg2.type
//   ) {
//   }
// }
