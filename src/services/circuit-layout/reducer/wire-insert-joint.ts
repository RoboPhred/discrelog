import { isWireSegmentInsertJointAction } from "@/actions/wire-segment-insert-joint";
import { createCircuitLayoutReducer } from "../utils";

export default createCircuitLayoutReducer((state, action) => {
  if (!isWireSegmentInsertJointAction(action)) {
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
