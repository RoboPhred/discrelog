import { v4 as uuidV4 } from "uuid";
import zipObject from "lodash/zipObject";

import { isAttachConnectionAction } from "@/actions/connection-attach";
import { fpSet } from "@/utils";

import { createCircuitLayoutReducer } from "../utils";

export default createCircuitLayoutReducer((state, action) => {
  if (!isAttachConnectionAction(action)) {
    return state;
  }

  const { connectionId, joints } = action.payload;

  if (joints.length > 0) {
    const jointIds = joints.map(() => uuidV4());
    state = fpSet(
      state,
      "connectionJointIdsByConnectionId",
      connectionId,
      jointIds
    );
    state = fpSet(state, "connectionJointPositionsByJointId", (value) => ({
      ...value,
      ...zipObject(jointIds, joints),
    }));
  } else {
    state = fpSet(state, "connectionJointIdsByConnectionId", connectionId, []);
  }

  return state;
});
