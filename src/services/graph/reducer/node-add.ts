import { AnyAction } from "redux";

import { reducerPriority, PRIORITY_PRE } from "@/store/priorities";

import { isAddNodeAction } from "@/actions/node-add";

import { createGraphReducer } from "../utils";

export default reducerPriority(
  PRIORITY_PRE,
  createGraphReducer((state, action: AnyAction) => {
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
          type: "element",
          elementType: type,
        },
      },
    };
  })
);
