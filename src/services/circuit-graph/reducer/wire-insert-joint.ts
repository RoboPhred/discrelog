import { v4 as uuidV4 } from "uuid";

import { isWireSegmentInsertJointAction } from "@/actions/wire-segment-insert-joint";

import { WireSegment } from "../types";
import { createCircuitGraphReducer } from "../utils";

import { wireJointInsert } from "./primitives/wire-joint-insert";
import { wireSegmentRemove } from "./primitives/wire-segment-remove";
import { wireSegmentInsert } from "./primitives/wire-segment-insert";

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

  state = wireJointInsert(state, wireId, newJointId, jointPos);
  state = wireSegmentRemove(state, wireSegmentId, {
    deleteWireIfLastSegment: false,
    removeOrphanJoints: false,
  });
  state = wireSegmentInsert(state, wireId, uuidV4(), firstSegment);
  state = wireSegmentInsert(state, wireId, uuidV4(), secondSegment);

  return state;
});
