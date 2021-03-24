import { v4 as uuidV4 } from "uuid";

import { isWireConnectPinToFloatingAction } from "@/actions/wire-connect-pin-to-floating";

import { circuitIdFromElementIdSelector } from "../selectors/elements";
import { pinIsWiredSelector } from "../selectors/wires";
import { pinDirectionFromElementPinSelector } from "../selectors/pins";

import { createCircuitGraphReducer } from "../utils";
import { WireSegment } from "../types";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isWireConnectPinToFloatingAction(action)) {
    return state;
  }

  const { floatPoint, pin } = action.payload;

  const direction = pinDirectionFromElementPinSelector(
    rootState,
    pin.elementId,
    pin.pinId
  );
  const pinCircuitId = circuitIdFromElementIdSelector(rootState, pin.elementId);
  if (!pinCircuitId || !direction) {
    return state;
  }

  if (
    direction === "input" &&
    pinIsWiredSelector(rootState, pin.elementId, pin.pinId)
  ) {
    return state;
  }

  const newWireId = uuidV4();
  const newSegmentId = uuidV4();
  const newJointId = uuidV4();

  let newSegment: WireSegment;
  if (direction === "input") {
    newSegment = {
      type: "input",
      inputPin: pin,
      jointId: newJointId,
      lineId: uuidV4(),
    };
  } else {
    newSegment = {
      type: "output",
      outputPin: pin,
      jointId: newJointId,
      lineId: uuidV4(),
    };
  }

  return {
    ...state,
    wireIdsByCircuitId: {
      [pinCircuitId]: [...state.wireIdsByCircuitId[pinCircuitId], newWireId],
    },
    wiresByWireId: {
      ...state.wiresByWireId,
      [newWireId]: {
        wireSegmentIds: [newSegmentId],
        wireJointIds: [newJointId],
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
