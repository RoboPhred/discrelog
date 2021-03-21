import { priorityBefore, reducerPriority } from "@/store/priorities";

import { isDeleteElementAction } from "@/actions/element-delete";

import elementGraphElementDeleteReducer from "@/services/element-graph/reducer/element-delete";

import { createElementLayoutReducer } from "../utils";

import elementDeleteOperation from "./operations/element-delete";

// We need to run this reducer before graph runs, as we want to check what wires are connected to the element being deleted.
export default reducerPriority(
  priorityBefore(elementGraphElementDeleteReducer),
  createElementLayoutReducer((state, action, rootState) => {
    if (!isDeleteElementAction(action)) {
      return state;
    }

    const { elementIds } = action.payload;

    return elementDeleteOperation(state, elementIds, rootState);
  })
);
