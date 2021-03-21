import { isAddWireJointAction } from "@/actions/wire-joint-add";

import { createElementLayoutReducer } from "../utils";

export default createElementLayoutReducer((state, action) => {
  if (!isAddWireJointAction(action)) {
    return state;
  }

  const { connectionId, addAfterJointId, position, jointId } = action.payload;
  let wireJoints = state.wireJointIdsByConnectionId[connectionId];
  const insertionIndex = addAfterJointId
    ? wireJoints.indexOf(addAfterJointId) + 1
    : 0;

  wireJoints = [
    ...wireJoints.slice(0, insertionIndex),
    jointId,
    ...wireJoints.slice(insertionIndex),
  ];

  return {
    ...state,
    wireJointIdsByConnectionId: {
      ...state.wireJointIdsByConnectionId,
      [connectionId]: wireJoints,
    },
    wireJointPositionsByJointId: {
      ...state.wireJointPositionsByJointId,
      [jointId]: position,
    },
  };
});
