import { CircuitGraphServiceState } from "../../state";
import { InputWireSegment, OutputWireSegment } from "../../types";

import { getJointIdsFromSegment, getSegmentIdsFromJoint } from "../../utils";

import { addSegment, removeJoint, removeSegment } from "./utils";
import wireSegmentDelete from "./wire-segment-delete";

export default function wireJointDelete(
  state: CircuitGraphServiceState,
  wireId: string,
  jointId: string
): CircuitGraphServiceState {
  const wire = state.wiresByWireId[wireId];
  if (!wire || wire.wireJointIds.indexOf(jointId) === -1) {
    return state;
  }

  const jointedSegmentIds = getSegmentIdsFromJoint(state, wireId, jointId);

  if (jointedSegmentIds.length === 2) {
    const mergedState = mergeSegments(
      state,
      wireId,
      jointedSegmentIds[0],
      jointedSegmentIds[1],
      jointId
    );
    if (mergedState) {
      return mergedState;
    }
  }

  state = jointedSegmentIds.reduce(
    (state, segmentId) => wireSegmentDelete(state, wireId, segmentId),
    state
  );

  return state;
}

function mergeSegments(
  state: CircuitGraphServiceState,
  wireId: string,
  segmentId1: string,
  segmentId2: string,
  jointId: string
): CircuitGraphServiceState | null {
  const seg1 = state.wireSegmentsById[segmentId1];
  const seg2 = state.wireSegmentsById[segmentId2];
  if (!seg1 || !seg2) {
    return null;
  }

  if (seg1.type === "input-output" || seg2.type === "input-output") {
    // Impossible to merge.  Impossible for a wire to have more than one segment if one is input-output anyway.
    return null;
  }

  // If we have inputs and outputs, try turning them into an input-output.
  if (
    (seg1.type === "input" || seg1.type === "output") &&
    (seg2.type === "input" || seg2.type === "output")
  ) {
    // Cannot merge two like-types.
    if (seg1.type === seg2.type) {
      return null;
    }

    // Segments dont share this joint.
    if (seg1.jointId !== jointId || seg2.jointId !== jointId) {
      return null;
    }

    const inputSegment =
      seg1.type === "input" ? seg1 : (seg2 as InputWireSegment);
    const outputSegment =
      seg1.type === "output" ? seg1 : (seg2 as OutputWireSegment);
    state = removeJoint(state, wireId, jointId);
    state = removeSegment(state, wireId, segmentId1, false);
    state = removeSegment(state, wireId, segmentId2, false);
    state = addSegment(state, wireId, {
      type: "input-output",
      inputPin: inputSegment.inputPin,
      outputPin: outputSegment.outputPin,
    });
    return state;
  }

  // At this point, at least one segment is a bridge, and the other is an input, output, or bridge.
  const bridge =
    seg1.type === "bridge" ? seg1 : seg2.type === "bridge" ? seg2 : null;
  if (!bridge) {
    return null;
  }

  // Alt can be an input, output, or bridge.
  const alt = seg1 === bridge ? seg2 : seg1;

  // This is the joint that will remain once we combine the segments, and will be part of the new segment.
  const bridgeRemainderJoint = getJointIdsFromSegment(bridge)
    .filter((x) => x !== jointId)
    .pop();
  if (!bridgeRemainderJoint) {
    return null;
  }

  state = removeJoint(state, wireId, jointId);
  state = removeSegment(state, wireId, segmentId1, false);
  state = removeSegment(state, wireId, segmentId2, false);

  switch (alt.type) {
    case "bridge": {
      const altRemainderJoint = getJointIdsFromSegment(alt)
        .filter((x) => x !== jointId)
        .pop();
      if (!altRemainderJoint) {
        return null;
      }
      state = addSegment(state, wireId, {
        type: "bridge",
        jointAId: bridgeRemainderJoint,
        jointBId: altRemainderJoint,
      });
      return state;
    }
    case "input":
    case "output": {
      // If we combine an input or output with a bridge, we just extend the input or output
      // to the far joint of the bridge.
      state = addSegment(state, wireId, {
        ...alt,
        jointId: bridgeRemainderJoint,
      });
      return state;
    }
  }

  return null;
}
