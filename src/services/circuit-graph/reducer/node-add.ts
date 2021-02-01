import { AnyAction } from "redux";

import { reducerPriority, PRIORITY_PRE } from "@/store/priorities";

import { isAddNodeAction } from "@/actions/node-add";

import { createCircuitGraphReducer } from "../utils";

export default reducerPriority(
  PRIORITY_PRE,
  createCircuitGraphReducer((state, action: AnyAction) => {
    if (!isAddNodeAction(action)) {
      return state;
    }

    const { nodeId: id, nodeType } = action.payload;
    return {
      ...state,
      nodesById: {
        ...state.nodesById,
        [id]: {
          nodeType,
        },
      },
    };
  })
);
