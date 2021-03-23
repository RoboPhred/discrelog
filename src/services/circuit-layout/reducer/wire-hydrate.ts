import { isHydrateWireAction } from "@/actions/wire-hydrate";
import { Point } from "@/geometry";
import { createCircuitLayoutReducer } from "../utils";

export default createCircuitLayoutReducer((state, action) => {
  if (!isHydrateWireAction(action)) {
    return state;
  }

  const { wireJoints } = action.payload;

  const newJoints: Record<string, Point> = {};
  for (const joint of wireJoints) {
    const { jointId, ...point } = joint;
    newJoints[jointId] = point;
  }

  return {
    ...state,
    wireJointPositionsByJointId: {
      ...state.wireJointPositionsByJointId,
      ...newJoints,
    },
  };
});
