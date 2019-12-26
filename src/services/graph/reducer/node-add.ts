import { AnyAction } from "redux";
import produce from "immer";
import mapValues from "lodash/mapValues";

import { isAddNodeAction } from "@/actions/node-add";

import { NodeTypes } from "@/node-defs";
import { inputsOf, outputsOf } from "@/node-defs/utils";

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
