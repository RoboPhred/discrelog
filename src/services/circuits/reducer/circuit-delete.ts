import pick from "lodash/pick";
import mapValues from "lodash/mapValues";
import difference from "lodash/difference";

import { isDeleteCircuitAction } from "@/actions/circuit-delete";
import { nodeIdsFromTypeSelector } from "@/services/node-graph/selectors/nodes";
import { circuitIdToNodeType } from "@/nodes/definitions/integrated-circuits/utils";

import { createCircuitsReducer } from "../utils";

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
    circuitIdToNodeType(circuitId)
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
