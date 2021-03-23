import pick from "lodash/pick";
import { v4 as uuidV4 } from "uuid";

import { isWireInsertJointAction } from "@/actions/wire-insert-joint";

import { WireSegment } from "../types";
import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action) => {
  if (!isWireInsertJointAction(action)) {
    return state;
  }

  const { wireId, wireSegmentId, jointId } = action.payload;

  const targetWire = state.wiresByWireId[wireId];
  if (!targetWire) {
    return state;
  }

  const targetSegment = state.wireSegmentsById[wireSegmentId];
  if (!targetSegment) {
    return state;
  }

  const firstSegmentId = uuidV4();
  const secondSegmentId = uuidV4();
  let firstSegment: WireSegment;
  let secondSegment: WireSegment;
  switch (targetSegment.type) {
    case "bridge":
      {
        firstSegment = {
          type: "bridge",
          jointAId: targetSegment.jointAId,
          jointBId: jointId,
        };
        secondSegment = {
          type: "bridge",
          jointAId: jointId,
          jointBId: targetSegment.jointBId,
        };
      }
      break;
    case "input":
    case "output":
      {
        firstSegment = {
          ...targetSegment,
          jointId,
        };
        secondSegment = {
          type: "bridge",
          jointAId: jointId,
          jointBId: targetSegment.jointId,
        };
      }
      break;
    case "input-output":
      {
        firstSegment = {
          type: "output",
          outputPin: targetSegment.outputPin,
          jointId,
        };
        secondSegment = {
          type: "input",
          outputPin: targetSegment.outputPin,
          inputPin: targetSegment.inputPin,
          jointId,
        };
      }
      break;
    default:
      return state;
  }

  // Remove the modified segment, it is to be replaced with the two new segments.
  const wireSegmentsById = pick(
    state.wireSegmentsById,
    Object.keys(state.wireSegmentsById).filter((id) => id !== wireSegmentId)
  );
  wireSegmentsById[firstSegmentId] = firstSegment;
  wireSegmentsById[secondSegmentId] = secondSegment;

  // Add the segment ids to the wire.
  const wiresByWireId = {
    ...state.wiresByWireId,
    [wireId]: {
      ...targetWire,
      wireSegmentIds: [
        ...targetWire.wireSegmentIds.filter((x) => x !== wireSegmentId),
        firstSegmentId,
        secondSegmentId,
      ],
    },
  };

  return {
    ...state,
    wireSegmentsById,
    wiresByWireId,
  };
});
