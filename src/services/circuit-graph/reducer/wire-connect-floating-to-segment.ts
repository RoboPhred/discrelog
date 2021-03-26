import { v4 as uuidV4 } from "uuid";

import { isWireConnectFloatingToSegmentAction } from "@/actions/wire-connect-floating-to-segment";

import { createCircuitGraphReducer } from "../utils";

import wireSegmentSplit from "./operations/wire-segment-split";
import { WireSegment } from "../types";
import { wireIdFromWireSegmentIdSelector } from "../selectors/wires";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isWireConnectFloatingToSegmentAction(action)) {
    return state;
  }

  const { wireSegmentId, segmentSplitLength, floatPoint } = action.payload;

  const [afterSplitState, segmentJointId] = wireSegmentSplit(
    state,
    wireSegmentId,
    segmentSplitLength,
    rootState
  );
  state = afterSplitState;
  if (!segmentJointId) {
    return state;
  }

  const wireId = wireIdFromWireSegmentIdSelector.local(state, wireSegmentId);
  if (!wireId) {
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
  const wire = state.wiresByWireId[wireId];
  const wiresByWireId: typeof state.wiresByWireId = {
    ...state.wiresByWireId,
    [wireId]: {
      ...wire,
      wireSegmentIds: [...wire.wireSegmentIds, floatSegmentId],
      wireJointIds: [...wire.wireJointIds, floatJointId],
    },
  };

  const wireJointPositionsByJointId: typeof state.wireJointPositionsByJointId = {
    ...state.wireJointPositionsByJointId,
    [floatJointId]: floatPoint,
  };

  // Segment is from an existing wire so we do not need to set the circuit id for the wire.

  return {
    ...state,
    wireSegmentsById,
    wiresByWireId,
    wireJointPositionsByJointId,
  };
});
