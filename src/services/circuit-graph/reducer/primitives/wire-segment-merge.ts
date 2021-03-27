import { v4 as uuidV4 } from "uuid";

import { wireIdFromWireSegmentIdSelector } from "../../selectors/wires";
import { CircuitGraphServiceState } from "../../state";
import { InputWireSegment, OutputWireSegment } from "../../types";
import { getJointIdsFromSegment } from "../../utils";

import { WireOperationError } from "../errors/WireOperationError";

import { wireJointRemove } from "./wire-joint-remove";
import { wireSegmentRemove } from "./wire-segment-remove";
import { wireSegmentInsert } from "./wire-segment-insert";

export function wireSegmentMerge(
  state: CircuitGraphServiceState,
  segmentId1: string,
  segmentId2: string,
  jointId: string
): CircuitGraphServiceState {
  const wireId1 = wireIdFromWireSegmentIdSelector.local(state, segmentId1);
  const wireId2 = wireIdFromWireSegmentIdSelector.local(state, segmentId2);

  if (!wireId1 || !wireId2) {
    throw new WireOperationError("Wire for segment not found.");
  }

  if (wireId1 !== wireId2) {
    throw new WireOperationError(
      "Merging segments from different wires is not supported."
    );
  }

  const seg1 = state.wireSegmentsById[segmentId1];
  const seg2 = state.wireSegmentsById[segmentId2];
  if (!seg1 || !seg2) {
    throw new WireOperationError("Wire segment not found.");
  }

  if (seg1.type === "input-output" || seg2.type === "input-output") {
    // Impossible to merge.  Impossible for a wire to have more than one segment if one is input-output anyway.
    throw new WireOperationError("Cannot merge input-output segments.");
  }

  // If we have inputs and outputs, try turning them into an input-output.
  if (
    (seg1.type === "input" || seg1.type === "output") &&
    (seg2.type === "input" || seg2.type === "output")
  ) {
    // Cannot merge two like-types.
    if (seg1.type === seg2.type) {
      throw new WireOperationError("Cannot merge two inputs or two outputs.");
    }

    // Segments dont share this joint.
    if (seg1.jointId !== jointId || seg2.jointId !== jointId) {
      throw new WireOperationError("Segments do not share the given joint.");
    }

    const inputSegment =
      seg1.type === "input" ? seg1 : (seg2 as InputWireSegment);
    const outputSegment =
      seg1.type === "output" ? seg1 : (seg2 as OutputWireSegment);
    state = wireJointRemove(state, jointId);
    state = wireSegmentRemove(state, segmentId1, {
      deleteWireIfLastSegment: false,
      removeOrphanJoints: false,
    });
    state = wireSegmentRemove(state, segmentId2, {
      deleteWireIfLastSegment: false,
      removeOrphanJoints: false,
    });
    state = wireSegmentInsert(state, wireId1, uuidV4(), {
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
    throw new WireOperationError("Cannot merge segment configuration.");
  }

  // Alt can be an input, output, or bridge.
  const alt = seg1 === bridge ? seg2 : seg1;

  // This is the joint that will remain once we combine the segments, and will be part of the new segment.
  const bridgeRemainderJoint = getJointIdsFromSegment(bridge)
    .filter((x) => x !== jointId)
    .pop();
  if (!bridgeRemainderJoint) {
    throw new WireOperationError("Cannot merge segment configuration.");
  }

  state = wireJointRemove(state, jointId);
  // Keep the joints, we will reuse them.
  state = wireSegmentRemove(state, segmentId1, {
    removeOrphanJoints: false,
    deleteWireIfLastSegment: false,
  });
  state = wireSegmentRemove(state, segmentId2, {
    removeOrphanJoints: false,
    deleteWireIfLastSegment: false,
  });

  switch (alt.type) {
    case "bridge": {
      const altRemainderJoint =
        alt.jointAId === jointId
          ? alt.jointBId
          : alt.jointBId === jointId
          ? alt.jointAId
          : null;
      if (!altRemainderJoint) {
        throw new WireOperationError("Segments do not share the given joint.");
      }
      state = wireSegmentInsert(state, wireId1, uuidV4(), {
        type: "bridge",
        jointAId: bridgeRemainderJoint,
        jointBId: altRemainderJoint,
      });
      return state;
    }
    case "input":
    case "output": {
      if (alt.jointId !== jointId) {
        throw new WireOperationError("Segments do not share the given joint.");
      }
      // If we combine an input or output with a bridge, we just extend the input or output
      // to the far joint of the bridge.
      state = wireSegmentInsert(state, wireId1, uuidV4(), {
        ...alt,
        jointId: bridgeRemainderJoint,
      });
      return state;
    }
  }

  throw new WireOperationError("Cannot merge segment configuration.");
}
