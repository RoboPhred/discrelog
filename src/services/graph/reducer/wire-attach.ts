import find from "lodash/find";

import { isAttachWireAction } from "@/actions/wire-attach";

import { createGraphReducer, pinsToConnection } from "../utils";
import { nodePinEquals } from "../types";

export default createGraphReducer((state, action) => {
  if (!isAttachWireAction(action)) {
    return state;
  }

  if (!isAttachWireAction(action)) {
    return state;
  }

  const { wireId, p1, p2 } = action.payload;
  const conn = pinsToConnection(state, p1, p2);
  if (!conn) {
    return state;
  }

  const { inputPin } = conn;

  // Only one source per input.
  if (find(state.wiresById, c => nodePinEquals(c.inputPin, inputPin))) {
    return state;
  }

  return {
    ...state,
    wiresById: {
      ...state.wiresById,
      [wireId]: {
        id: wireId,
        ...conn
      }
    }
  };
});
