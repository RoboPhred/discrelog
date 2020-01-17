import pick from "lodash/pick";
import difference from "lodash/difference";

import { isDetatchWireAction } from "@/actions/wire-detatch";
import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isDetatchWireAction(action)) {
    return state;
  }

  const { wireId } = action.payload;

  const remainingWireIds = Object.keys(state.wireJointIdsByWireId).filter(
    x => x != wireId
  );

  const remainingJointIds = difference(
    Object.keys(state.wireJointPositionsByJointId),
    state.wireJointIdsByWireId[wireId]
  );

  return {
    ...state,
    wireJointIdsByWireId: pick(state.wireJointIdsByWireId, remainingWireIds),
    wireJointPositionsByJointId: pick(
      state.wireJointPositionsByJointId,
      remainingJointIds
    )
  };
});
