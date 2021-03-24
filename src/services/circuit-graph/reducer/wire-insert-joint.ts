import pick from "lodash/pick";
import { v4 as uuidV4 } from "uuid";

import { isWireSegmentInsertJointAction } from "@/actions/wire-segment-insert-joint";

import { WireSegment } from "../types";
import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action) => {
  if (!isWireSegmentInsertJointAction(action)) {
    return state;
  }

  const { wireId, wireSegmentId, jointPos } = action.payload;

  const targetWire = state.wiresByWireId[wireId];
  if (!targetWire) {
    return state;
  }

  const targetSegment = state.wireSegmentsById[wireSegmentId];
  if (!targetSegment) {
    return state;
  }

  const newJointId = uuidV4();

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
          jointBId: newJointId,
        };
        secondSegment = {
          type: "bridge",
          jointAId: newJointId,
          jointBId: targetSegment.jointBId,
        };
      }
      break;
    case "input":
    case "output":
      {
        firstSegment = {
          ...targetSegment,
          jointId: newJointId,
        };
        secondSegment = {
          type: "bridge",
          jointAId: newJointId,
          jointBId: targetSegment.jointId,
        };
      }
      break;
    case "input-output":
      {
        const lineId = uuidV4();
        firstSegment = {
          type: "output",
          outputPin: targetSegment.outputPin,
          jointId: newJointId,
          lineId,
        };
        secondSegment = {
          type: "input",
          inputPin: targetSegment.inputPin,
          jointId: newJointId,
          lineId,
        };
      }
      break;
    default:
      return state;
  }

  // Remove the modified segment, it is to be replaced with the two new segments.
  const wireSegmentsById: typeof state.wireSegmentsById = pick(
    state.wireSegmentsById,
    Object.keys(state.wireSegmentsById).filter((id) => id !== wireSegmentId)
  );
  wireSegmentsById[firstSegmentId] = firstSegment;
  wireSegmentsById[secondSegmentId] = secondSegment;

  // Add the segment ids to the wire.
  const wiresByWireId: typeof state.wiresByWireId = {
    ...state.wiresByWireId,
    [wireId]: {
      ...targetWire,
      wireSegmentIds: [
        ...targetWire.wireSegmentIds.filter((x) => x !== wireSegmentId),
        firstSegmentId,
        secondSegmentId,
      ],
      wireJointIds: [...targetWire.wireJointIds, newJointId],
    },
  };

  const wireJointPositionsByJointId: typeof state.wireJointPositionsByJointId = {
    ...state.wireJointPositionsByJointId,
    [newJointId]: jointPos,
  };

  return {
    ...state,
    wireSegmentsById,
    wiresByWireId,
    wireJointPositionsByJointId,
  };
});
