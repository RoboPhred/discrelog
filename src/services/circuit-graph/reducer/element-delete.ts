import { isDeleteElementAction } from "@/actions/element-delete";

import { priorityBefore, reducerPriority } from "@/store/priorities";

import circuitsElementDeleteReducer from "@/services/circuits/reducer/element-delete";

import { createCircuitGraphReducer } from "../utils";

import elementDelete from "./operations/element-delete";

// We need to know what circuit the element was a part of
export default reducerPriority(
  priorityBefore(circuitsElementDeleteReducer),
  createCircuitGraphReducer((state, action, rootState) => {
    if (!isDeleteElementAction(action)) {
      return state;
    }

    const { elementIds } = action.payload;

    return elementDelete(state, elementIds, rootState);
  })
);
