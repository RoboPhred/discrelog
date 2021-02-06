import pick from "lodash/pick";
import mapValues from "lodash/mapValues";
import difference from "lodash/difference";

import { isDeleteCircuitAction } from "@/actions/circuit-delete";

import { createCircuitsReducer } from "../utils";
import { nodeIdsFromTypeSelector } from "@/services/node-graph/selectors/nodes";

export default createCircuitsReducer((state, action, rootState) => {
  if (!isDeleteCircuitAction(action)) {
    return state;
  }

  const { circuitId } = action.payload;

  const remainingCircuitIds = Object.keys(state.circuitNamesByCircuitId).filter(
    (x) => x !== circuitId
  );

  const circuitTypeNodeIds = nodeIdsFromTypeSelector(
    rootState,
    `ic-${circuitId}`
  );

  let nodeIdsByCircuitId = pick(state.nodeIdsByCircuitId, remainingCircuitIds);

  nodeIdsByCircuitId = mapValues(nodeIdsByCircuitId, (nodeIds) =>
    difference(nodeIds, circuitTypeNodeIds)
  );

  return {
    ...state,
    nodeIdsByCircuitId: nodeIdsByCircuitId,
    circuitNamesByCircuitId: pick(
      state.circuitNamesByCircuitId,
      remainingCircuitIds
    ),
  };
});
