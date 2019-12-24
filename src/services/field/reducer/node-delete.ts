import pick from "lodash/pick";
import difference from "lodash/difference";

import { isDeleteNodeAction } from "@/actions/node-delete";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isDeleteNodeAction(action)) {
    return state;
  }

  const { nodeIds } = action.payload;

  return {
    ...state,
    nodePositions: pick(
      state.nodePositionsById,
      difference(Object.keys(state.nodePositionsById), nodeIds)
    )
  };
});
