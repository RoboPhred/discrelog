import pick from "lodash/pick";

import { isDetatchWireAction } from "@/actions/wire-detatch";

import { createNodeGraphReducer } from "../utils";

export default createNodeGraphReducer((state, action) => {
  if (!isDetatchWireAction(action)) {
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
