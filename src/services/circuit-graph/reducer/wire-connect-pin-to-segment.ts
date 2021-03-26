import { isWireConnectPinToSegmentAction } from "@/actions/wire-connect-pin-to-segment";

import { createCircuitGraphReducer } from "../utils";

import wireSegmentSplit from "./operations/wire-segment-split";

import wireConnectPin from "./operations/wire-connect-pin";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isWireConnectPinToSegmentAction(action)) {
    return state;
  }

  const originalState = state;

  const { wireSegmentId, segmentSplitLength, pin } = action.payload;

  const [afterSplitState, segmentJointId] = wireSegmentSplit(
    state,
    wireSegmentId,
    segmentSplitLength,
    rootState
  );
  state = afterSplitState;
  if (!segmentJointId) {
    return originalState;
  }

  // FIXME: Let user select line id.
  const connectedState = wireConnectPin(
    state,
    segmentJointId,
    pin,
    null,
    rootState
  );
  return connectedState ?? originalState;
});
