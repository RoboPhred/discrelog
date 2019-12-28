import pick from "lodash/pick";

import { isDetatchWireAction } from "@/actions/wire-detatch";
import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isDetatchWireAction(action)) {
    return state;
  }

  const { wireId } = action.payload;

  const remainingWireIds = Object.keys(state.wireJointsByWireId).filter(
    x => x != wireId
  );

  return {
    ...state,
    wireJointsByWireId: pick(state.wireJointsByWireId, remainingWireIds)
  };
});
