import { CircuitGraphServiceState } from "../../state";
import { getSegmentIdsFromJoint } from "../../utils";

import { wireIdFromWireJointIdSelector } from "../../selectors/wires";

import { WireOperationError } from "../errors/WireOperationError";

import { wireSegmentMerge } from "../primitives/wire-segment-merge";

import wireSegmentDelete from "./wire-segment-delete";

export function wireJointMergeOrDelete(
  state: CircuitGraphServiceState,
  jointId: string
): CircuitGraphServiceState {
  const wireId = wireIdFromWireJointIdSelector.local(state, jointId);
  if (!wireId) {
    throw new WireOperationError("Wire for joint not found");
  }

  const jointedSegmentIds = getSegmentIdsFromJoint(state, wireId, jointId);

  if (jointedSegmentIds.length === 2) {
    try {
      return wireSegmentMerge(
        state,
        jointedSegmentIds[0],
        jointedSegmentIds[1],
        jointId
      );
    } catch (e) {
      if (e instanceof WireOperationError === false) {
        throw e;
      }
    }
  }

  state = jointedSegmentIds.reduce(
    (state, segmentId) => wireSegmentDelete(state, segmentId),
    state
  );

  return state;
}
