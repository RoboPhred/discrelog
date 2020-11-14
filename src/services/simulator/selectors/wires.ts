import createCachedSelector from "re-reselect";

import { AppState } from "@/store";
import { IDMap } from "@/types";

import { Wire } from "@/services/graph/types";

export const wireValueFromWireIdSelector = createCachedSelector(
  (state: AppState, wireId: string) => state.services.graph.wiresById[wireId],
  (state: AppState) => state.services.simulator.nodeOutputValuesByNodeId,
  (wire: Wire, outputVauesByNodeId: IDMap<IDMap<boolean>>) => {
    if (!wire) {
      return false;
    }

    const {
      outputPin: { nodeId, pinId },
    } = wire;

    return outputVauesByNodeId[nodeId]?.[pinId] || false;
  }
)((_: any, wireId: string) => wireId);
