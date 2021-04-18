import pick from "lodash/pick";

import { CircuitGraphServiceState } from "../../state";
import { getJointIdsFromSegment } from "../../utils";

import { wireIdFromWireSegmentIdSelector } from "../../selectors/wires";

import { WireOperationError } from "../errors/WireOperationError";
import { wireRemove } from "./wire-remove";
import { wireJointRemove } from "./wire-joint-remove";

export interface WireSegmentRemoveOpts {
  deleteWireIfLastSegment?: boolean;
  removeOrphanJoints?: boolean;
}
export function wireSegmentRemove(
  state: CircuitGraphServiceState,
  segmentId: string,
  {
    deleteWireIfLastSegment = true,
    removeOrphanJoints = true,
  }: WireSegmentRemoveOpts = {}
): CircuitGraphServiceState {
  const wireId = wireIdFromWireSegmentIdSelector.local(state, segmentId);
  if (!wireId) {
    throw new WireOperationError("Wire for segment not found.");
  }

  const segment = state.wireSegmentsById[segmentId];
  if (!segment) {
    throw new WireOperationError("Segment not found");
  }

  const remainingSegmentIds = state.wiresByWireId[wireId].wireSegmentIds.filter(
    (x) => x !== segmentId
  );

  if (deleteWireIfLastSegment && remainingSegmentIds.length === 0) {
    return wireRemove(state, wireId);
  }

  if (removeOrphanJoints) {
    const joints = getJointIdsFromSegment(segment);
    for (const jointId of joints) {
      if (
        remainingSegmentIds.every(
          (remainingSegmentId) =>
            getJointIdsFromSegment(
              state.wireSegmentsById[remainingSegmentId]
            ).indexOf(jointId) === -1
        )
      ) {
        // No other segment uses this joint.
        state = wireJointRemove(state, jointId);
      }
    }
  }

  return {
    ...state,
    wiresByWireId: {
      ...state.wiresByWireId,
      [wireId]: {
        // Re-obtain wire ref as wireRemoveJoint will have changed it.
        ...state.wiresByWireId[wireId],
        wireSegmentIds: remainingSegmentIds,
      },
    },
    wireSegmentsById: pick(
      state.wireSegmentsById,
      Object.keys(state.wireSegmentsById).filter((x) => x !== segmentId)
    ),
  };
}
