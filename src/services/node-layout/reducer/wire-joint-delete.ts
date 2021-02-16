import pick from "lodash/pick";
import mapValues from "lodash/mapValues";

import { isDeleteWireJointAction } from "@/actions/wire-joint-delete";

import { createNodeLayoutReducer } from "../utils";

export default createNodeLayoutReducer((state, action) => {
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
    wireJointsByJointId: pick(
      state.wireJointPositionsByJointId,
      remainingJointIds
    ),
  };
});