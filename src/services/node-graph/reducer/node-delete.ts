import { isDeleteNodeAction } from "@/actions/node-delete";

import { priorityBefore, reducerPriority } from "@/store/priorities";

import circuitsNodeDeleteReducer from "@/services/circuits/reducer/node-delete";

import { createNodeGraphReducer } from "../utils";

import nodeDelete from "./operations/node-delete";

// We need to know what circuit the node was a part of
export default reducerPriority(
  priorityBefore(circuitsNodeDeleteReducer),
  createNodeGraphReducer((state, action, rootState) => {
    if (!isDeleteNodeAction(action)) {
      return state;
    }

    const { nodeIds } = action.payload;

    return nodeDelete(state, nodeIds, rootState);
  })
);
