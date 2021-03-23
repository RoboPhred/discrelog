import find from "lodash/find";

import { isAttachConnectionAction } from "@/actions/connection-attach";

import { createCircuitGraphReducer, pinsToConnection } from "../utils";
import { elementPinEquals } from "../types";

export default createCircuitGraphReducer((state, action, rootState) => {
  if (!isAttachConnectionAction(action)) {
    return state;
  }

  const { connectionId, p1, p2 } = action.payload;
  const conn = pinsToConnection(state, p1, p2, rootState);
  if (!conn) {
    return state;
  }

  const { inputPin } = conn;

  // Only one source per input.
  if (
    find(state.connectionsById, (c) => elementPinEquals(c.inputPin, inputPin))
  ) {
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
