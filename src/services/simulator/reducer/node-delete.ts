import pick from "lodash/pick";

import { AppState } from "@/store";
import { nodeIdsSelector } from "@/services/graph/selectors/nodes";
import { isDeleteNodeAction } from "@/actions/node-delete";

import { SimulatorState } from "../state";

import { createSimulatorReducer } from "../utils";
import { removeTransitionById } from "./utils";

export default createSimulatorReducer((state, action, appState) => {
  if (!isDeleteNodeAction(action)) {
    return state;
  }

  const { nodeIds } = action.payload;

  return nodeIds.reduce(
    (state, nodeId) => deleteNodeById(state, nodeId, appState),
    state
  );
});

function deleteNodeById(
  state: SimulatorState,
  nodeId: string,
  appState: AppState
): SimulatorState {
  const removeTransitionIds = Object.keys(state.transitionsById).filter(
    id => state.transitionsById[id].nodeId === nodeId
  );

  state = removeTransitionIds.reduce(
    (state, transitionId) => removeTransitionById(state, transitionId),
    state
  );

  const remainingNodeIds = nodeIdsSelector(appState).filter(x => x !== nodeId);

  return {
    ...state,
    nodeStatesByNodeId: pick(state.nodeStatesByNodeId, remainingNodeIds),
    nodeOutputValuesByNodeId: pick(
      state.nodeOutputValuesByNodeId,
      remainingNodeIds
    )
  };
}
