import { AppState } from "@/store";

import {
  connectionFromConnectionIdSelector,
  connectionIdFromInputPinSelector,
} from "@/services/node-graph/selectors/connections";
import { nodeTypeFromNodeIdSelector } from "@/services/node-graph/selectors/nodes";

import { nodeOutputsFromCircuitNodeIdSelector } from "./nodes";

// Doesn't need caching for react since it returns primitives, but
// the additional complexity of tracing IC pins might make it a bit heavy.
export const wireValueFromConnectionIdSelector = (
  state: AppState,
  icNodePath: string[],
  connectionId: string
): boolean => {
  const connection = connectionFromConnectionIdSelector(state, connectionId);
  if (!connection) {
    return false;
  }

  const {
    outputPin: { nodeId, pinId },
  } = connection;

  const nodeType = nodeTypeFromNodeIdSelector(state, nodeId);
  if (nodeType === "pin-input") {
    // TODO: The ultimate connection id from the input pin is a good candidate
    // for caching in its own selector, as the ultimate source connection
    // id of a pin is something that only changes with the simulator graph.

    // The node id of the ic is the ic-node we are contained in.
    const nextIcNodePath = icNodePath.slice(0, icNodePath.length - 1);
    const inputNodeId = icNodePath[icNodePath.length - 1];
    // pin id of the IC is the node id of the pin.
    const inputPinId = nodeId;

    const nextConnectionId = connectionIdFromInputPinSelector(state, {
      nodeId: inputNodeId,
      pinId: inputPinId,
    });
    if (!nextConnectionId) {
      return false;
    }

    return wireValueFromConnectionIdSelector(
      state,
      nextIcNodePath,
      nextConnectionId
    );
  } else {
    const outputs = nodeOutputsFromCircuitNodeIdSelector(state, [
      ...icNodePath,
      nodeId,
    ]);
    if (!outputs) {
      return false;
    }
    return outputs[pinId] || false;
  }
};
