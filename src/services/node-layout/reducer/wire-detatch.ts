import pick from "lodash/pick";
import difference from "lodash/difference";

import { isDetatchWireAction } from "@/actions/wire-detatch";

import { createNodeLayoutReducer } from "../utils";

export default createNodeLayoutReducer((state, action) => {
  if (!isDetatchWireAction(action)) {
    return state;
  }

  const { connectionId } = action.payload;

  const remainingConnectionIds = Object.keys(
    state.wireJointIdsByConnectionId
  ).filter((x) => x != connectionId);

  const remainingJointIds = difference(
    Object.keys(state.wireJointPositionsByJointId),
    state.wireJointIdsByConnectionId[connectionId]
  );

  return {
    ...state,
    wireJointIdsByConnectionId: pick(
      state.wireJointIdsByConnectionId,
      remainingConnectionIds
    ),
    wireJointPositionsByJointId: pick(
      state.wireJointPositionsByJointId,
      remainingJointIds
    ),
  };
});
