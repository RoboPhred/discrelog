import { priorityBefore, reducerPriority } from "@/store/priorities";

import { isDeleteCircuitAction } from "@/actions/circuit-delete";

import { nodeIdsFromCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import circuitsCircuitDeleteReducer from "@/services/circuits/reducer/circuit-delete";
import { circuitIdToNodeType } from "@/nodes/definitions/integrated-circuits/utils";

import { createNodeGraphReducer } from "../utils";
import { nodeIdsFromTypeSelector } from "../selectors/nodes";

import nodeDelete from "./operations/node-delete";

export default reducerPriority(
  priorityBefore(circuitsCircuitDeleteReducer),
  createNodeGraphReducer((state, action, rootState) => {
    if (!isDeleteCircuitAction(action)) {
      return state;
    }

    const { circuitId } = action.payload;

    const inCircuitNodeIds = nodeIdsFromCircuitIdSelector(rootState, circuitId);

    const circuitTypeNodeIds = nodeIdsFromTypeSelector(
      rootState,
      circuitIdToNodeType(circuitId)
    );

    const nodeIds = [...inCircuitNodeIds, ...circuitTypeNodeIds];

    return nodeDelete(state, nodeIds, rootState);
  })
);
