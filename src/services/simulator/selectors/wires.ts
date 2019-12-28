import { AppState } from "@/store";

import { nodeOutputPinValue } from "./nodes";

export const wireValueSelector = (state: AppState, wireId: string) => {
  const {
    outputPin: { nodeId, pinId }
  } = state.services.graph.wiresById[wireId];

  return nodeOutputPinValue(state, nodeId, pinId);
};
