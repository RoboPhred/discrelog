import pick from "lodash/pick";
import difference from "lodash/difference";
import pickBy from "lodash/pickBy";

import { priorityBefore, reducerPriority } from "@/store/priorities";

import { isDeleteCircuitAction } from "@/actions/circuit-delete";

import { nodeIdsFromCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import circuitsCircuitDeleteReducer from "@/services/circuits/reducer/circuit-delete";

import { Connection } from "../types";
import { createNodeGraphReducer } from "../utils";
import { nodeIdsFromTypeSelector } from "../selectors/nodes";

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
      `ic-${circuitId}`
    );

    const nodeIds = [...inCircuitNodeIds, ...circuitTypeNodeIds];

    const remainingNodeIds = difference(Object.keys(state.nodesById), nodeIds);

    function isRemainingConnection(c: Connection) {
      return (
        remainingNodeIds.indexOf(c.inputPin.nodeId) !== -1 &&
        remainingNodeIds.indexOf(c.outputPin.nodeId) !== -1
      );
    }

    return {
      ...state,
      nodesById: pick(state.nodesById, remainingNodeIds),
      connectionsById: pickBy(state.connectionsById, isRemainingConnection),
    };
  })
);
