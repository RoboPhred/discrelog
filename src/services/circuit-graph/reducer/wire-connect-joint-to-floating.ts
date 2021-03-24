import { v4 as uuidV4 } from "uuid";

import { isWireConnectJointToFloatingAction } from "@/actions/wire-connect-joint-to-floating";

import { createCircuitGraphReducer } from "../utils";
import { WireSegment } from "../types";

export default createCircuitGraphReducer((state, action) => {
  if (!isWireConnectJointToFloatingAction(action)) {
    return state;
  }

  const { wireId, jointId, floatPoint } = action.payload;

  const wire = state.wiresByWireId[wireId];
  if (!wire || wire.wireJointIds.indexOf(jointId) === -1) {
    return state;
  }

  const newSegmentId = uuidV4();
  const newJointId = uuidV4();
  const newSegment: WireSegment = {
    type: "bridge",
    jointAId: jointId,
    jointBId: newJointId,
  };

  return {
    ...state,
    wiresByWireId: {
      ...state.wiresByWireId,
      [wireId]: {
        ...wire,
        wireSegmentIds: [...wire.wireSegmentIds, newSegmentId],
        wireJointIds: [...wire.wireJointIds, newJointId],
      },
    },
    wireSegmentsById: {
      ...state.wireSegmentsById,
      [newSegmentId]: newSegment,
    },
    wireJointPositionsByJointId: {
      ...state.wireJointPositionsByJointId,
      [newJointId]: floatPoint,
    },
  };
});
