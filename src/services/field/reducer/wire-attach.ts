import { isAttachWireAction } from "@/actions/wire-attach";
import { fpSet } from "@/utils";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isAttachWireAction(action)) {
    return state;
  }

  const { wireId } = action.payload;

  return fpSet(state, "wireJointIdsByWireId", wireId, []);
});
