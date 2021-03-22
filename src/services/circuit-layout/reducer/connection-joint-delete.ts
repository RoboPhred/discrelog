import pick from "lodash/pick";
import mapValues from "lodash/mapValues";

import { isDeleteConnectionJointAction } from "@/actions/connection-joint-delete";

import { createCircuitLayoutReducer } from "../utils";

export default createCircuitLayoutReducer((state, action) => {
  if (!isDeleteConnectionJointAction(action)) {
    return state;
  }

  const { jointId } = action.payload;

  const remainingJointIds = Object.keys(
    state.connectionJointPositionsByJointId
  ).filter((x) => x !== jointId);

  return {
    ...state,
    connectionJointIdsByConnectionId: mapValues(
      state.connectionJointIdsByConnectionId,
      (connectionIds) => connectionIds.filter((x) => x !== jointId)
    ),
    connectionJointPositionsByJointId: pick(
      state.connectionJointPositionsByJointId,
      remainingJointIds
    ),
  };
});
