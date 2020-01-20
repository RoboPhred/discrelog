import uuidV4 from "uuid/v4";
import zipObject from "lodash/zipObject";

import { isAttachWireAction } from "@/actions/wire-attach";
import { fpSet } from "@/utils";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isAttachWireAction(action)) {
    return state;
  }

  const { wireId, joints } = action.payload;

  // Might want to use addWireJoint action, but field is the only thing that cares about joints.
  if (joints.length > 0) {
    const jointIds = joints.map(x => uuidV4());
    fpSet(state, "wireJointIdsByWireId", wireId, jointIds);
    fpSet(state, "wireJointPositionsByJointId", value => ({
      ...value,
      ...zipObject(jointIds, joints)
    }));
  }

  return fpSet(state, "wireJointIdsByWireId", wireId, []);
});
