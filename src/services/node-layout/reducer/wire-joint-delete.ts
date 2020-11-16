import pick from "lodash/pick";
import mapValues from "lodash/mapValues";

import { isDeleteWireJointAction } from "@/actions/wire-joint-delete";

import { createFieldReducer } from "../utils";

export default createFieldReducer((state, action) => {
  if (!isDeleteWireJointAction(action)) {
    return state;
  }

  const { jointId } = action.payload;

  const remainingJointIds = Object.keys(
    state.wireJointPositionsByJointId
  ).filter((x) => x !== jointId);

  return {
    ...state,
    wireJointIdsByWireId: mapValues(state.wireJointIdsByWireId, (wireIds) =>
      wireIds.filter((x) => x !== jointId)
    ),
    wireJointsByJointId: pick(
      state.wireJointPositionsByJointId,
      remainingJointIds
    ),
  };
});
