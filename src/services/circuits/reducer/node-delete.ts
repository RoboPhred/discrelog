import { isDeleteNodeAction } from "@/actions/node-delete";
import mapValues from "lodash/mapValues";

import { createCircuitsReducer } from "../utils";

export default createCircuitsReducer((state, action) => {
  if (!isDeleteNodeAction(action)) {
    return state;
  }

  const { nodeIds } = action.payload;

  return {
    ...state,
    nodeIdsByCircuitId: mapValues(state.nodeIdsByCircuitId, (circuitNodeIds) =>
      circuitNodeIds.filter(
        (circuitNodeId) => nodeIds.indexOf(circuitNodeId) === -1
      )
    ),
  };
});
