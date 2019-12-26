import { nodeIdsSelector } from "@/services/graph/selectors/nodes";
import { isDetatchWireAction } from "@/actions/wire-detatch";

import { createSimulatorReducer } from "../utils";

import { collectNodeTransitions } from "./transition-utils";

export default createSimulatorReducer((state, action, appState) => {
  if (!isDetatchWireAction(action)) {
    return state;
  }

  // TODO: Make this reducer run before graph/wire-detatch so we can figure out
  //  what node we need to collect transitions for.

  // For now, just collect transitions on all nodes.
  for (const nodeId of nodeIdsSelector(appState)) {
    state = collectNodeTransitions(state, nodeId, appState);
  }
  return state;
});
