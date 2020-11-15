import { isAddElementAction } from "@/actions/element-add";

import { createSimulatorReducer } from "../utils";

import { collectNodeTransitions } from "./utils";

export default createSimulatorReducer((state, action, appState) => {
  // TODO: Also trigger for chips
  if (!isAddElementAction(action)) {
    return state;
  }

  const { nodeId } = action.payload;

  return collectNodeTransitions(state, nodeId, appState);
});
