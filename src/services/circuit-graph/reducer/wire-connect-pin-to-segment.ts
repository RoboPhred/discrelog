import { v4 as uuidV4 } from "uuid";

import { isWireConnectPinToSegmentAction } from "@/actions/wire-connect-pin-to-segment";

import { createCircuitGraphReducer } from "../utils";

import wireSegmentSplit from "./operations/wire-segment-split";

import { pinDirectionFromElementPinSelector } from "../selectors/pins";
import { pinIsWiredSelector } from "../selectors/wires";

import { WireSegment } from "../types";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isWireConnectPinToSegmentAction(action)) {
    return state;
  }

  const { wireId, wireSegmentId, segmentSplitLength, pin } = action.payload;

  const direction = pinDirectionFromElementPinSelector(
    rootState,
    pin.elementId,
    pin.pinId
  );
  if (!direction) {
    return state;
  }

  if (
    direction === "input" &&
    pinIsWiredSelector(rootState, pin.elementId, pin.pinId)
  ) {
    return state;
  }

  const [afterSplitState, segmentJointId] = wireSegmentSplit(
    state,
    wireId,
    wireSegmentId,
    segmentSplitLength,
    rootState
  );
  state = afterSplitState;
  if (!segmentJointId) {
    return state;
  }

  // Add the floating segment
  const pinSegmentId = uuidV4();
  let pinSegment: WireSegment;

  // FIXME: Let user choose the line id!
  let lineId: string | null = null;
  for (const segmentId of state.wiresByWireId[wireId].wireSegmentIds) {
    const segment = state.wireSegmentsById[segmentId];
    if (segment.type === "input" || segment.type === "output") {
      lineId = segment.lineId;
      break;
    }
  }
  if (!lineId) {
    lineId = uuidV4();
  }

  if (direction === "input") {
    pinSegment = {
      type: "input",
      inputPin: pin,
      lineId,
      jointId: segmentJointId,
    };
  } else {
    pinSegment = {
      type: "output",
      outputPin: pin,
      lineId,
      jointId: segmentJointId,
    };
  }

  const wireSegmentsById: typeof state.wireSegmentsById = {
    ...state.wireSegmentsById,
    [pinSegmentId]: pinSegment,
  };

  // Add the segment ids to the wire.
  const wire = state.wiresByWireId[wireId];
  const wiresByWireId: typeof state.wiresByWireId = {
    ...state.wiresByWireId,
    [wireId]: {
      ...wire,
      wireSegmentIds: [...wire.wireSegmentIds, pinSegmentId],
      wireJointIds: [...wire.wireJointIds, pinSegmentId],
    },
  };

  // Segment is from an existing wire so we do not need to set the circuit id for the wire.

  return {
    ...state,
    wireSegmentsById,
    wiresByWireId,
  };
});
