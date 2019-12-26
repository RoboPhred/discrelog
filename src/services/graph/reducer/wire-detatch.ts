import { isDetatchWireNodeAction } from "@/actions/wire-detatch";

import { pinsToConnection, createGraphReducer } from "../utils";

import { nodePinEquals, Connection } from "../types";

export default createGraphReducer((state, action) => {
  if (!isDetatchWireNodeAction(action)) {
    return state;
  }

  const { p1, p2 } = action.payload;
  const conn = pinsToConnection(state, p1, p2);
  if (!conn) {
    return state;
  }

  const { outputPin, inputPin } = conn;

  function isTargetConnection(conn: Connection) {
    return (
      nodePinEquals(conn.inputPin, inputPin) &&
      nodePinEquals(conn.outputPin, outputPin)
    );
  }

  return {
    ...state,
    connections: state.connections.filter(conn => !isTargetConnection(conn))
  };
});
