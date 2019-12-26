import pick from "lodash/pick";
import difference from "lodash/difference";

import { isDetatchWireAction } from "@/actions/wire-detatch";

import { createGraphReducer } from "../utils";

export default createGraphReducer((state, action) => {
  if (!isDetatchWireAction(action)) {
    return state;
  }

  const { wireId } = action.payload;

  const remainingIds = Object.keys(state.wiresById).filter(x => x !== wireId);

  return {
    ...state,
    wiresById: pick(state.wiresById, remainingIds)
  };
});
