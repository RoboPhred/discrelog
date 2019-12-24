import find from "lodash/find";

import { nodePinEquals } from "@/types";
import { isAttachWireAction } from "@/actions/wire-attach";

import { pinsToConnection, createSimulatorReducer } from "../utils";

import { collectNodeTransitions } from "./transition-utils";

export default createSimulatorReducer((state, action) => {
  if (!isAttachWireAction(action)) {
    return state;
  }

  const { p1, p2 } = action.payload;
  const conn = pinsToConnection(state, p1, p2);
  if (!conn) {
    return state;
  }

  const { inputPin } = conn;

  // Only one source per input.
  if (find(state.connections, c => nodePinEquals(c.inputPin, inputPin))) {
    return state;
  }

  state = {
    ...state,
    connections: [...state.connections, conn]
  };

  return collectNodeTransitions(state, inputPin.nodeId);
});
