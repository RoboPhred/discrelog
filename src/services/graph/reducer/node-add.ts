import { AnyAction } from "redux";

import { isAddNodeAction } from "@/actions/node-add";

import { createGraphReducer } from "../utils";

export default createGraphReducer((state, action: AnyAction) => {
  if (!isAddNodeAction(action)) {
    return state;
  }

  const { nodeId: id, nodeType: type } = action.payload;
  return {
    ...state,
    nodesById: {
      ...state.nodesById,
      [id]: {
        id,
        type
      }
    }
  };
});
