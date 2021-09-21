import intersection from "lodash/intersection";

import { isWireJointDeleteAction } from "@/actions/wire-joint-delete";

import { createSelectionReducer } from "../utils";
import { PRIORITY_POST, reducerPriority } from "@/store/priorities";

export default reducerPriority(
  PRIORITY_POST,
  createSelectionReducer((state, action, rootState) => {
    if (!isWireJointDeleteAction(action)) {
      return state;
    }

    const {
      wireJointPositionsByJointId,
      wireSegmentsById,
    } = rootState.services.circuitGraph;

    return {
      ...state,
      selectedWireJointIds: intersection(
        state.selectedWireJointIds,
        Object.keys(wireJointPositionsByJointId)
      ),
      selectedWireSegmentIds: intersection(
        state.selectedWireSegmentIds,
        Object.keys(wireSegmentsById)
      ),
    };
  })
);
