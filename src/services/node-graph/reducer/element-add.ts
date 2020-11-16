import { AnyAction } from "redux";

import { reducerPriority, PRIORITY_PRE } from "@/store/priorities";

import { isAddElementAction } from "@/actions/element-add";

import { createGraphReducer } from "../utils";

export default reducerPriority(
  PRIORITY_PRE,
  createGraphReducer((state, action: AnyAction) => {
    if (!isAddElementAction(action)) {
      return state;
    }

    const { nodeId: id, elementType } = action.payload;
    return {
      ...state,
      nodesById: {
        ...state.nodesById,
        [id]: {
          nodeId: id,
          type: "element",
          elementType,
        },
      },
    };
  })
);
