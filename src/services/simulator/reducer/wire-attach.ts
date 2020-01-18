import { isAttachWireAction } from "@/actions/wire-attach";

import { createSimulatorReducer } from "../utils";

import { collectNodeTransitions } from "./utils";

export default createSimulatorReducer((state, action, appState) => {
  if (!isAttachWireAction(action)) {
    return state;
  }

  const { p1, p2 } = action.payload;

  // We only need to recalculate the input,
  //  but we do not know which one that is.

  state = collectNodeTransitions(state, p1.nodeId, appState);
  state = collectNodeTransitions(state, p2.nodeId, appState);
  return state;
});
