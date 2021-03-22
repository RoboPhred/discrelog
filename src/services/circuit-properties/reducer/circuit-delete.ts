import pick from "lodash/pick";

import { isDeleteCircuitAction } from "@/actions/circuit-delete";

import { createCircuitPropertiesReducer } from "../utils";

export default createCircuitPropertiesReducer((state, action) => {
  if (!isDeleteCircuitAction(action)) {
    return state;
  }

  const { circuitId } = action.payload;

  const remainingCircuitIds = Object.keys(state.circuitNamesByCircuitId).filter(
    (x) => x !== circuitId
  );

  return {
    ...state,
    circuitNamesByCircuitId: pick(
      state.circuitNamesByCircuitId,
      remainingCircuitIds
    ),
  };
});
