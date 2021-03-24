import { isWireJointMoveAction } from "@/actions/wire-joint-move";
import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action) => {
  if (!isWireJointMoveAction(action)) {
    return state;
  }

  const { jointId, x, y } = action.payload;

  return {
    ...state,
    wireJointPositionsByJointId: {
      ...state.wireJointPositionsByJointId,
      [jointId]: { x, y },
    },
  };
});
