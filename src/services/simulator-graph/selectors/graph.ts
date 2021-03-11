import { createSelector } from "reselect";

import { nodeIdsByCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { nodeTypesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { connectionsByIdSelector } from "@/services/node-graph/selectors/connections";
import { nodeDefinitionsByTypeSelector } from "@/services/node-types/selectors/node-types";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";

import { produceCircuitGraph } from "../graph-production";

export const rootNodeGraphSelector = createSelector(
  nodeIdsByCircuitIdSelector,
  nodeTypesByNodeIdSelector,
  connectionsByIdSelector,
  nodeDefinitionsByTypeSelector,
  (nodeIdsByCircuitId, nodeTypesByNodeId, connectionsById, nodeDefsByType) => {
    return produceCircuitGraph(ROOT_CIRCUIT_ID, {
      nodeIdsByCircuitId,
      nodeTypesByNodeId,
      connectionsById,
      nodeDefsByType,
    });
  }
);
