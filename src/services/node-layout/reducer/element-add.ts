import { fpSet } from "@/utils";

import { ZeroPoint } from "@/geometry";
import { isAddElementAction } from "@/actions/element-add";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isAddElementAction(action)) {
    return state;
  }
  const { nodeId, position = ZeroPoint } = action.payload;

  return fpSet(state, "nodePositionsById", nodeId, position);
});
