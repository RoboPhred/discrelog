import { priorityBefore, reducerPriority } from "@/store/priorities";

import { isDeleteElementAction } from "@/actions/element-delete";

import circuitGraphElementDeleteReducer from "@/services/circuit-graph/reducer/element-delete";

import { createCircuitLayoutReducer } from "../utils";

import elementDeleteOperation from "./operations/element-delete";

// We need to run this reducer before graph runs, as we want to check what connections are on the element being deleted.
export default reducerPriority(
  priorityBefore(circuitGraphElementDeleteReducer),
  createCircuitLayoutReducer((state, action, rootState) => {
    if (!isDeleteElementAction(action)) {
      return state;
    }

    const { elementIds } = action.payload;

    return elementDeleteOperation(state, elementIds, rootState);
  })
);
