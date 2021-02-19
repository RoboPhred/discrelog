import { v4 as uuidV4 } from "uuid";
import zipObject from "lodash/zipObject";

import { isAttachWireAction } from "@/actions/wire-attach";
import { fpSet } from "@/utils";

import { createNodeLayoutReducer } from "../utils";

export default createNodeLayoutReducer((state, action) => {
  if (!isAttachWireAction(action)) {
    return state;
  }

  const { connectionId, joints } = action.payload;

  // Might want to use addWireJoint action, but field is the only thing that cares about joints.
  if (joints.length > 0) {
    const jointIds = joints.map(() => uuidV4());
    state = fpSet(state, "wireJointIdsByConnectionId", connectionId, jointIds);
    state = fpSet(state, "wireJointPositionsByJointId", (value) => ({
      ...value,
      ...zipObject(jointIds, joints),
    }));
  } else {
    state = fpSet(state, "wireJointIdsByConnectionId", connectionId, []);
  }

  return state;
});
