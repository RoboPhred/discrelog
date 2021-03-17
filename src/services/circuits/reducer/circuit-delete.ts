import { AnyAction } from "redux";

import pick from "lodash/pick";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { circuitIdToNodeType } from "@/nodes/definitions/integrated-circuits/utils";

import { isDeleteCircuitAction } from "@/actions/circuit-delete";
import { deleteNode } from "@/actions/node-delete";

import { nodeIdsFromTypeSelector } from "@/services/node-graph/selectors/nodes";

export default (state: AppState = defaultAppState, action: AnyAction) => {
  if (!isDeleteCircuitAction(action)) {
    return state;
  }

  const { circuitId } = action.payload;

  const nodeIdsInCircuit =
    state.services.circuits.nodeIdsByCircuitId[circuitId];
  if (!nodeIdsInCircuit) {
    return state;
  }

  // The node ids of instances of this circuit.
  const circuitTypeNodeIds = nodeIdsFromTypeSelector(
    state,
    circuitIdToNodeType(circuitId)
  );

  const nodeIdsToDelete = [...circuitTypeNodeIds, ...nodeIdsInCircuit];

  // We used to handle this in a seperate reducer in node-graph, but we need to
  // know the node types before deletion to know which instances of the circuit to delete,
  // and node-graph needs to know what nodes are in each circuit.  This means
  // both need the data from the other, and they cannot be ordered separately.
  // This might be a sign that we need to move nodeIdsByCircuitId into node-graph,
  // but this way seems cleaner as it keeps the separation of concerns while
  // leveraging actions to reuse the node deletion code.
  state = nodeIdsToDelete.reduce(
    (state, nodeId) => rootReducer(state, deleteNode(nodeId)),
    state
  );

  const remainingCircuitIds = Object.keys(
    state.services.circuits.nodeIdsByCircuitId
  ).filter((x) => x !== circuitId);

  return fpSet(state, "services", "circuits", (serviceState) => ({
    ...serviceState,
    nodeIdsByCircuitId: pick(
      serviceState.nodeIdsByCircuitId,
      remainingCircuitIds
    ),
    circuitNamesByCircuitId: pick(
      serviceState.circuitNamesByCircuitId,
      remainingCircuitIds
    ),
  }));
};
