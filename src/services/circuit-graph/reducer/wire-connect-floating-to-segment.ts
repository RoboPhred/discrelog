import { v4 as uuidV4 } from "uuid";

import { isWireConnectFloatingToSegmentAction } from "@/actions/wire-connect-floating-to-segment";

import { createCircuitGraphReducer } from "../utils";

import wireSegmentSplit from "./operations/wire-segment-split";
import { WireSegment } from "../types";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isWireConnectFloatingToSegmentAction(action)) {
    return state;
  }

  const {
    wireId,
    wireSegmentId,
    segmentPositionFraction,
    floatPoint,
  } = action.payload;

  const [afterSplitState, segmentJointId] = wireSegmentSplit(
    state,
    wireId,
    wireSegmentId,
    segmentPositionFraction,
    rootState
  );
  state = afterSplitState;
  if (!segmentJointId) {
    return state;
  }

  // Add the floating segment
  const floatSegmentId = uuidV4();
  const floatJointId = uuidV4();

  const floatSegment: WireSegment = {
    type: "bridge",
    jointAId: segmentJointId,
    jointBId: floatJointId,
  };
  const wireSegmentsById: typeof state.wireSegmentsById = {
    ...state.wireSegmentsById,
    [floatSegmentId]: floatSegment,
  };

  // Add the segment ids to the wire.
  const wiresByWireId: typeof state.wiresByWireId = {
    ...state.wiresByWireId,
    [wireId]: {
      ...state.wiresByWireId[wireId],
      wireSegmentIds: [
        ...state.wiresByWireId[wireId].wireSegmentIds,
        floatSegmentId,
      ],
    },
  };

  const wireJointPositionsByJointId: typeof state.wireJointPositionsByJointId = {
    ...state.wireJointPositionsByJointId,
    [floatJointId]: floatPoint,
  };

  return {
    ...state,
    wireSegmentsById,
    wiresByWireId,
    wireJointPositionsByJointId,
  };
});
