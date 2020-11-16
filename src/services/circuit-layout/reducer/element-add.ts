import { fpSet } from "@/utils";

import { ZeroPoint } from "@/geometry";
import { isAddElementAction } from "@/actions/element-add";

import { createCircuitLayoutReducer } from "../utils";

export default createCircuitLayoutReducer((state, action) => {
  if (!isAddElementAction(action)) {
    return state;
  }
  const { nodeId, position = ZeroPoint } = action.payload;

  return fpSet(state, "nodePositionsById", nodeId, position);
});
