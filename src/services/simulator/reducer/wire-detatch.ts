import { isDetatchWireNodeAction } from "@/actions/wire-detatch";

import { createSimulatorReducer } from "../utils";

import { collectNodeTransitions } from "./transition-utils";

export default createSimulatorReducer((state, action, appState) => {
  if (!isDetatchWireNodeAction(action)) {
    return state;
  }

  const { p1, p2 } = action.payload;

  // We only need to update the input pin, but we do not know which one that is.
  state = collectNodeTransitions(state, p1.nodeId, appState);
  state = collectNodeTransitions(state, p2.nodeId, appState);
  return state;
});
