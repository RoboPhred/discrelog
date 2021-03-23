import { isWireConnectPinToPinAction } from "@/actions/wire-connect-pin-to-pin";

import { pinDirectionFromElementPinSelector } from "../selectors/pins";
import { pinIsWiredSelector } from "../selectors/wires";

import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isWireConnectPinToPinAction(action)) {
    return state;
  }

  const { pin1, pin2, segmentId, wireId } = action.payload;

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

  const inputPin = pin1Direction === "input" ? pin1 : pin2;
  const outputPin = pin1Direction === "output" ? pin1 : pin2;
  if (pinIsWiredSelector(rootState, inputPin.elementId, inputPin.pinId)) {
    return state;
  }

  return {
    ...state,
    wiresByWireId: {
      ...state.wiresByWireId,
      [wireId]: {
        wireSegmentIds: [segmentId],
      },
    },
    wireSegmentsById: {
      ...state.wireSegmentsById,
      [segmentId]: {
        type: "input-output",
        inputPin,
        outputPin,
      },
    },
  };
});
