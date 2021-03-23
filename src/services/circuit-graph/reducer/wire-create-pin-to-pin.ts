import { isWireCreatePinToPinAction } from "@/actions/wire-create-pin-to-pin";

import { pinDirectionFromElementPinSelector } from "../selectors/pins";
import { pinIsWiredSelector } from "../selectors/wires";

import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isWireCreatePinToPinAction(action)) {
    return state;
  }

  const { pin1, pin2, segmentId, wireId } = action.payload;

  // Do checks to see if we can actually create the pin.
  // Ideally this would be done in the reducers, but due to seperating the layout from the graph,
  // the layout will not know to ignore the action if the graph ignores it...
  // I guess we could finally accept redux-thunk into our lives and do this check there...
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
