import { AppState } from "@/store";

export const wireValueSelector = (state: AppState, wireId: string) => {
  const {
    outputPin: { nodeId, pinId }
  } = state.services.graph.wiresById[wireId];
  return state.services.simulator.nodeOutputValuesByNodeId[nodeId][pinId];
};
