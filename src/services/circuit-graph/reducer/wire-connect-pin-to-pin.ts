import { v4 as uuidV4 } from "uuid";

import { isWireConnectPinToPinAction } from "@/actions/wire-connect-pin-to-pin";

import { circuitIdFromElementIdSelector } from "../selectors/elements";
import { pinDirectionFromElementPinSelector } from "../selectors/pins";
import { pinIsWiredSelector } from "../selectors/wires";

import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isWireConnectPinToPinAction(action)) {
    return state;
  }

  const { pin1, pin2, newWireId } = action.payload;

  const newSegmentId = uuidV4();

  const pin1Direction = pinDirectionFromElementPinSelector(
    rootState,
    pin1.elementId,
    pin1.pinId
  );
  const pin2Direction = pinDirectionFromElementPinSelector(
    rootState,
    pin2.elementId,
    pin2.pinId
  );
  if (pin1Direction === pin2Direction) {
    return state;
  }

  const pin1Circuit = circuitIdFromElementIdSelector(rootState, pin1.elementId);
  const pin2Circuit = circuitIdFromElementIdSelector(rootState, pin2.elementId);
  if (!pin1Circuit || pin1Circuit !== pin2Circuit) {
    return state;
  }

  const inputPin = pin1Direction === "input" ? pin1 : pin2;
  const outputPin = pin1Direction === "output" ? pin1 : pin2;
  if (pinIsWiredSelector(rootState, inputPin.elementId, inputPin.pinId)) {
    return state;
  }

  return {
    ...state,
    wireIdsByCircuitId: {
      [pin1Circuit]: [...state.wireIdsByCircuitId[pin1Circuit], newWireId],
    },
    wiresByWireId: {
      ...state.wiresByWireId,
      [newWireId]: {
        wireSegmentIds: [newSegmentId],
        wireJointIds: [],
      },
    },
    wireSegmentsById: {
      ...state.wireSegmentsById,
      [newSegmentId]: {
        type: "input-output",
        inputPin,
        outputPin,
      },
    },
  };
});
