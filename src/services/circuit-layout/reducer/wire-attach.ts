import { v4 as uuidV4 } from "uuid";
import zipObject from "lodash/zipObject";

import { isAttachWireAction } from "@/actions/wire-attach";
import { fpSet } from "@/utils";

import { createCircuitLayoutReducer } from "../utils";

export default createCircuitLayoutReducer((state, action) => {
  if (!isAttachWireAction(action)) {
    return state;
  }

  const { connectionId, joints } = action.payload;

  // Might want to use addWireJoint action, but field is the only thing that cares about joints.
  if (joints.length > 0) {
    const jointIds = joints.map((x) => uuidV4());
    fpSet(state, "wireJointIdsByConnectionId", connectionId, jointIds);
    fpSet(state, "wireJointPositionsByJointId", (value) => ({
      ...value,
      ...zipObject(jointIds, joints),
    }));
  }

  return fpSet(state, "wireJointIdsByConnectionId", connectionId, []);
});