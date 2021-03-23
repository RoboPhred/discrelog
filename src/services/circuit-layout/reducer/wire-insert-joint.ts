import { isWireInsertJointAction } from "@/actions/wire-insert-joint";
import { createCircuitLayoutReducer } from "../utils";

export default createCircuitLayoutReducer((state, action) => {
  if (!isWireInsertJointAction(action)) {
    return state;
  }

  const { jointId, jointPos } = action.payload;

  return {
    ...state,
    wireJointPositionsByJointId: {
      ...state.wireJointPositionsByJointId,
      [jointId]: jointPos,
    },
  };
});
