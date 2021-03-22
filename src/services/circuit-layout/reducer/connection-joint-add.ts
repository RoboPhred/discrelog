import { isAddConnectionJointAction } from "@/actions/connection-joint-add";

import { createCircuitLayoutReducer } from "../utils";

export default createCircuitLayoutReducer((state, action) => {
  if (!isAddConnectionJointAction(action)) {
    return state;
  }

  const { connectionId, addAfterJointId, position, jointId } = action.payload;
  let joints = state.connectionJointIdsByConnectionId[connectionId];
  const insertionIndex = addAfterJointId
    ? joints.indexOf(addAfterJointId) + 1
    : 0;

  joints = [
    ...joints.slice(0, insertionIndex),
    jointId,
    ...joints.slice(insertionIndex),
  ];

  return {
    ...state,
    connectionJointIdsByConnectionId: {
      ...state.connectionJointIdsByConnectionId,
      [connectionId]: joints,
    },
    connectionJointPositionsByJointId: {
      ...state.connectionJointPositionsByJointId,
      [jointId]: position,
    },
  };
});
