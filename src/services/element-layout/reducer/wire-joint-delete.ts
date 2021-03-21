import pick from "lodash/pick";
import mapValues from "lodash/mapValues";

import { isDeleteWireJointAction } from "@/actions/wire-joint-delete";

import { createElementLayoutReducer } from "../utils";

export default createElementLayoutReducer((state, action) => {
  if (!isDeleteWireJointAction(action)) {
    return state;
  }

  const { jointId } = action.payload;

  const remainingJointIds = Object.keys(
    state.wireJointPositionsByJointId
  ).filter((x) => x !== jointId);

  return {
    ...state,
    wireJointIdsByConnectionId: mapValues(
      state.wireJointIdsByConnectionId,
      (connectionIds) => connectionIds.filter((x) => x !== jointId)
    ),
    wireJointPositionsByJointId: pick(
      state.wireJointPositionsByJointId,
      remainingJointIds
    ),
  };
});
