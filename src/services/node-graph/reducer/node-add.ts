import { AnyAction } from "redux";

import { reducerPriority, PRIORITY_PRE } from "@/store/priorities";

import { isAddNodeAction } from "@/actions/node-add";

import { createNodeGraphReducer } from "../utils";

export default reducerPriority(
  PRIORITY_PRE,
  createNodeGraphReducer((state, action: AnyAction) => {
    if (!isAddNodeAction(action)) {
      return state;
    }

    const { nodeId: id, nodeType, nodeName } = action.payload;
    return {
      ...state,
      nodesById: {
        ...state.nodesById,
        [id]: {
          nodeType,
          nodeName: nodeName ?? null,
        },
      },
    };
  })
);
