import createCachedSelector from "re-reselect";

import { AppState } from "@/store";

import { Connection } from "@/services/node-graph/types";
import { SimulatorNodeIdMappingTreeItem } from "@/services/simulator-graph/state";
import { getSimulatorNodeIdFromCircuitNodeIdPath } from "@/services/simulator-graph/utils";

export const wireValueFromConnectionIdSelector = createCachedSelector(
  (state: AppState, icNodePath: string[], connectionId: string) =>
    state.services.nodeGraph.connectionsById[connectionId],
  (state: AppState, icNodePath: string[]) => icNodePath,
  (state: AppState) =>
    state.services.simulatorGraph.simulatorNodeIdsByCircuitNodeId,
  (state: AppState) => state.services.simulator.nodeOutputValuesByNodeId,
  (
    wire: Connection,
    icNodePath: string[],
    simulatorNodeIdsByCircuitNodeId: Record<
      string,
      SimulatorNodeIdMappingTreeItem
    >,
    outputVauesByNodeId: Record<string, Record<string, boolean>>
  ) => {
    if (!wire) {
      return false;
    }

    const {
      outputPin: { nodeId, pinId },
    } = wire;

    const simulatorNodeId = getSimulatorNodeIdFromCircuitNodeIdPath(
      simulatorNodeIdsByCircuitNodeId,
      [...icNodePath, nodeId]
    );
    if (!simulatorNodeId) {
      return false;
    }

    return outputVauesByNodeId[simulatorNodeId]?.[pinId] || false;
  }
)(
  (_: any, icNodePath: string[], connectionId: string) =>
    icNodePath.join(".") + "::" + connectionId
);
