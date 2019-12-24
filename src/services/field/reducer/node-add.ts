import { fpSet } from "@/utils";

import { ZeroPoint } from "@/geometry";
import { isAddNodeAction } from "@/actions/node-add";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isAddNodeAction(action)) {
    return state;
  }
  const { nodeId: id, position = ZeroPoint } = action.payload;

  return fpSet(state, "nodePositionsById", id, position);
});
