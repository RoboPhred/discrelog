import { isDetatchWireAction } from "@/actions/wire-detatch";

import { createSimulatorReducer } from "../utils";

import { collectNodeTransitions } from "./utils";
import { wireByIdSelector } from "@/services/graph/selectors/wires";

export default createSimulatorReducer((state, action, appState) => {
  if (!isDetatchWireAction(action)) {
    return state;
  }

  const { wireId } = action.payload;

  const wire = wireByIdSelector(appState, wireId);
  if (!wire) {
    return state;
  }

  const affectedNodes = [wire.inputPin.nodeId, wire.outputPin.nodeId];

  // For now, just collect transitions on all nodes.
  for (const nodeId of affectedNodes) {
    state = collectNodeTransitions(state, nodeId, appState);
  }
  return state;
});
