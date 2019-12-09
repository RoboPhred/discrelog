import { fpSet } from "@/utils";

import { isAddNodeAction } from "../actions/node-add";

import { createEditorReducer } from "./utils";

export default createEditorReducer((state, action) => {
  if (!isAddNodeAction(action)) {
    return state;
  }
  const { nodeId: id, x = 0, y = 0 } = action.payload;
  return fpSet(state, "nodePositions", id, { x, y });
});
