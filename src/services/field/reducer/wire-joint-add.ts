import { isAddWireJointAction } from "@/actions/wire-joint-add";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isAddWireJointAction(action)) {
    return state;
  }

  const { wireId, addAfterJointId, position, jointId } = action.payload;
  let wireJoints = state.wireJointIdsByWireId[wireId];
  let insertionIndex = addAfterJointId
    ? wireJoints.indexOf(addAfterJointId) + 1
    : 0;

  wireJoints = [
    ...wireJoints.slice(0, insertionIndex),
    jointId,
    ...wireJoints.slice(insertionIndex),
  ];

  return {
    ...state,
    wireJointIdsByWireId: {
      ...state.wireJointIdsByWireId,
      [wireId]: wireJoints,
    },
    wireJointPositionsByJointId: {
      ...state.wireJointPositionsByJointId,
      [jointId]: position,
    },
  };
});
