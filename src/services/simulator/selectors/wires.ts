import createCachedSelector from "re-reselect";

import { AppState } from "@/store";

import { Connection } from "@/services/circuit-graph/types";

export const wireValueFromConnectionIdSelector = createCachedSelector(
  (state: AppState, connectionId: string) =>
    state.services.circuitGraph.connectionsById[connectionId],
  (state: AppState) => state.services.simulator.nodeOutputValuesByNodeId,
  (
    wire: Connection,
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
)((_: any, connectionId: string) => connectionId);
