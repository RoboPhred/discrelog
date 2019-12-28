import { isAddWireJointAction } from "@/actions/wire-joint-add";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isAddWireJointAction(action)) {
    return state;
  }

  const { wireId, jointIndex, position } = action.payload;

  let wireJoints = state.wireJointsByWireId[wireId];
  wireJoints = [
    ...wireJoints.slice(0, jointIndex),
    position,
    ...wireJoints.slice(jointIndex)
  ];

  return {
    ...state,
    wireJointsByWireId: {
      ...state.wireJointsByWireId,
      [wireId]: wireJoints
    }
  };
});
