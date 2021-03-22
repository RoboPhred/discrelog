import pick from "lodash/pick";
import difference from "lodash/difference";

import { isDetatchConnectionAction } from "@/actions/connection-detatch";

import { createCircuitLayoutReducer } from "../utils";

export default createCircuitLayoutReducer((state, action) => {
  if (!isDetatchConnectionAction(action)) {
    return state;
  }

  const { connectionId } = action.payload;

  const remainingConnectionIds = Object.keys(
    state.connectionJointIdsByConnectionId
  ).filter((x) => x != connectionId);

  const remainingJointIds = difference(
    Object.keys(state.connectionJointPositionsByJointId),
    state.connectionJointIdsByConnectionId[connectionId]
  );

  return {
    ...state,
    connectionJointIdsByConnectionId: pick(
      state.connectionJointIdsByConnectionId,
      remainingConnectionIds
    ),
    connectionJointPositionsByJointId: pick(
      state.connectionJointPositionsByJointId,
      remainingJointIds
    ),
  };
});
