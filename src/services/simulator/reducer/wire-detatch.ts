import { collectNodeTransitions } from "./transition-utils";
import { nodePinEquals } from "../types";
import { isDetatchWireNodeAction } from "../actions/wire-detatch";

import { pinsToConnection, createSimulatorReducer } from "./utils";

export default createSimulatorReducer((state, action) => {
  if (!isDetatchWireNodeAction(action)) {
    return state;
  }

  const { p1, p2 } = action.payload;
  const conn = pinsToConnection(state, p1, p2);
  if (!conn) {
    return state;
  }

  const { outputPin, inputPin } = conn;

  state = {
    ...state,
    connections: state.connections.filter(
      conn =>
        !(
          nodePinEquals(conn.inputPin, inputPin) &&
          nodePinEquals(conn.outputPin, outputPin)
        )
    )
  };

  return collectNodeTransitions(state, inputPin.nodeId);
});
