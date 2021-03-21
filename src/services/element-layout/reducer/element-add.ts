import { fpSet } from "@/utils";

import { ZeroPoint } from "@/geometry";
import { isAddElementAction } from "@/actions/element-add";

import { createElementLayoutReducer } from "../utils";

export default createElementLayoutReducer((state, action) => {
  if (!isAddElementAction(action)) {
    return state;
  }
  const { elementId, position = ZeroPoint } = action.payload;

  return fpSet(state, "elementPositionsById", elementId, position);
});
