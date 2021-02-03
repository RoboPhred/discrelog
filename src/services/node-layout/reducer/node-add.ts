import { fpSet } from "@/utils";

import { ZeroPoint } from "@/geometry";
import { isAddNodeAction } from "@/actions/node-add";

import { createNodeLayoutReducer } from "../utils";

export default createNodeLayoutReducer((state, action) => {
  if (!isAddNodeAction(action)) {
    return state;
  }
  const { nodeId, position = ZeroPoint } = action.payload;

  return fpSet(state, "nodePositionsById", nodeId, position);
});
