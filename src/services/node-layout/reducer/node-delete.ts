import { priorityBefore, reducerPriority } from "@/store/priorities";

import { isDeleteNodeAction } from "@/actions/node-delete";

import nodeGraphNodeDeleteReducer from "@/services/node-graph/reducer/node-delete";

import { createNodeLayoutReducer } from "../utils";

import nodeDeleteOperation from "./operations/node-delete";

// We need to run this reducer before graph runs, as we want to check what wires are connected to the node being deleted.
export default reducerPriority(
  priorityBefore(nodeGraphNodeDeleteReducer),
  createNodeLayoutReducer((state, action, rootState) => {
    if (!isDeleteNodeAction(action)) {
      return state;
    }

    const { nodeIds } = action.payload;

    return nodeDeleteOperation(state, nodeIds, rootState);
  })
);
