import pick from "lodash/pick";

import { isDetatchConnectionAction } from "@/actions/connection-detatch";

import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action) => {
  if (!isDetatchConnectionAction(action)) {
    return state;
  }

  const { connectionId } = action.payload;

  const remainingIds = Object.keys(state.connectionsById).filter(
    (x) => x !== connectionId
  );

  return {
    ...state,
    connectionsById: pick(state.connectionsById, remainingIds),
  };
});
