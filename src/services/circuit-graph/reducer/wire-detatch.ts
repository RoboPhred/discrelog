import pick from "lodash/pick";

import { isDetatchWireAction } from "@/actions/wire-detatch";

import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action) => {
  if (!isDetatchWireAction(action)) {
    return state;
  }

  const { wireId } = action.payload;

  const remainingIds = Object.keys(state.wiresById).filter((x) => x !== wireId);

  return {
    ...state,
    wiresById: pick(state.wiresById, remainingIds),
  };
});
