import createCachedSelector from "re-reselect";

import { AppState } from "@/store";

import { Connection } from "@/services/node-graph/types";

export const wireValueFromConnectionIdSelector = createCachedSelector(
  (state: AppState, connectionId: string) =>
    state.services.nodeGraph.connectionsById[connectionId],
  (state: AppState) =>
    state.services.simulatorGraph.simulatorNodeIdsByCircuitNodeId,
  (state: AppState) => state.services.simulator.nodeOutputValuesByNodeId,
  (
    wire: Connection,
    simulatorNodeIdsByCircuitNodeId: Record<string, string>,
    outputVauesByNodeId: Record<string, Record<string, boolean>>
  ) => {
    if (!wire) {
      return false;
    }

    const {
      outputPin: { nodeId, pinId },
    } = wire;

    const simulatorNodeId = simulatorNodeIdsByCircuitNodeId[nodeId];

    return outputVauesByNodeId[simulatorNodeId]?.[pinId] || false;
  }
)((_: any, connectionId: string) => connectionId);
