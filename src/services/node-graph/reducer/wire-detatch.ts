import pick from "lodash/pick";

import { reducerPriority, PRIORITY_POST } from "@/store/priorities";

import { isDetatchWireAction } from "@/actions/wire-detatch";

import { createGraphReducer } from "../utils";

export default reducerPriority(
  PRIORITY_POST,
  createGraphReducer((state, action) => {
    if (!isDetatchWireAction(action)) {
      return state;
    }

    const { wireId } = action.payload;

    const remainingIds = Object.keys(state.wiresById).filter(
      (x) => x !== wireId
    );

    return {
      ...state,
      wiresById: pick(state.wiresById, remainingIds),
    };
  })
);
