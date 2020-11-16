import createCachedSelector from "re-reselect";

import { AppState } from "@/store";

import { Wire } from "@/services/circuit-graph/types";

export const wireValueFromWireIdSelector = createCachedSelector(
  (state: AppState, wireId: string) =>
    state.services.circuitGraph.wiresById[wireId],
  (state: AppState) => state.services.simulator.nodeOutputValuesByNodeId,
  (
    wire: Wire,
    outputVauesByNodeId: Record<string, Record<string, boolean>>
  ) => {
    if (!wire) {
      return false;
    }

    const {
      outputPin: { nodeId, pinId },
    } = wire;

    return outputVauesByNodeId[nodeId]?.[pinId] || false;
  }
)((_: any, wireId: string) => wireId);
