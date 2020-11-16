import find from "lodash/find";

import { isAttachWireAction } from "@/actions/wire-attach";

import { createCircuitGraphReducer, pinsToConnection } from "../utils";
import { nodePinEquals } from "../types";

export default createCircuitGraphReducer((state, action) => {
  if (!isAttachWireAction(action)) {
    return state;
  }

  const { connectionId, p1, p2 } = action.payload;
  const conn = pinsToConnection(state, p1, p2);
  if (!conn) {
    return state;
  }

  const { inputPin } = conn;

  // Only one source per input.
  if (find(state.connectionsById, (c) => nodePinEquals(c.inputPin, inputPin))) {
    return state;
  }

  return {
    ...state,
    connectionsById: {
      ...state.connectionsById,
      [connectionId]: {
        id: connectionId,
        ...conn,
      },
    },
  };
});
