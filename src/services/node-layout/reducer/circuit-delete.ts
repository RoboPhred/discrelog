import { priorityBefore, reducerPriority } from "@/store/priorities";

import { isDeleteCircuitAction } from "@/actions/circuit-delete";

import nodeGraphCircuitDeleteReducer from "@/services/node-graph/reducer/circuit-delete";
import { nodeIdsFromCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { nodeIdsFromTypeSelector } from "@/services/node-graph/selectors/nodes";
import { circuitIdToNodeType } from "@/nodes/definitions/integrated-circuits/utils";

import { createNodeLayoutReducer } from "../utils";

import nodeDeleteOperation from "./operations/node-delete";

export default reducerPriority(
  // We need to run this reducer before graph runs, as we want to check what wires are connected to the node being deleted.
  priorityBefore(nodeGraphCircuitDeleteReducer),
  createNodeLayoutReducer((state, action, rootState) => {
    if (!isDeleteCircuitAction(action)) {
      return state;
    }

    const { circuitId } = action.payload;
    const inCircuitNodeIds = nodeIdsFromCircuitIdSelector(rootState, circuitId);

    state = nodeDeleteOperation(state, inCircuitNodeIds, rootState);

    const circuitTypeNodeIds = nodeIdsFromTypeSelector(
      rootState,
      circuitIdToNodeType(circuitId)
    );

    state = nodeDeleteOperation(state, circuitTypeNodeIds, rootState);

    return state;
  })
);
