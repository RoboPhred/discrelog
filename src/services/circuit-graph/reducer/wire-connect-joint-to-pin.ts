import { v4 as uuidV4 } from "uuid";

import { isWireConnectJointToPinAction } from "@/actions/wire-connect-joint-to-pin";

import { pinDirectionFromElementPinSelector } from "../selectors/pins";
import { pinIsWiredSelector } from "../selectors/wires";

import { createCircuitGraphReducer } from "../utils";
import { WireSegment } from "../types";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isWireConnectJointToPinAction(action)) {
    return state;
  }

  const { wireId, jointId, pin } = action.payload;

  const wire = state.wiresByWireId[wireId];
  if (!wire || wire.wireJointIds.indexOf(jointId) === -1) {
    return state;
  }

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

  const newSegmentId = uuidV4();
  let newSegment: WireSegment;
  if (direction == "input") {
    newSegment = {
      type: "input",
      inputPin: pin,
      jointId,
      lineId,
    };
  } else {
    newSegment = {
      type: "output",
      outputPin: pin,
      jointId,
      lineId,
    };
  }

  return {
    ...state,
    wiresByWireId: {
      ...state.wiresByWireId,
      [wireId]: {
        ...wire,
        wireSegmentIds: [...wire.wireSegmentIds, newSegmentId],
      },
    },
    wireSegmentsById: {
      ...state.wireSegmentsById,
      [newSegmentId]: newSegment,
    },
  };
});
