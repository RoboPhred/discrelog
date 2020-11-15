import { v4 as uuidV4 } from "uuid";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import findIndex from "lodash/findIndex";
import zipObject from "lodash/zipObject";

import { pointSubtract } from "@/geometry";

import { isCopyNodesAction } from "@/actions/clipboard-copy";

import { nodeFromNodeIdSelector } from "@/services/graph/selectors/nodes";
import { nodeOutputSourcesByPinIdFromNodeIdSelector } from "@/services/graph/selectors/wires";
import { nodePositionsByNodeIdSelector } from "@/services/field/selectors/node-positions";

import { ClipboardNode } from "../types";
import { createClipboardReducer } from "../utils";

export default createClipboardReducer((state, action, appState) => {
  if (!isCopyNodesAction(action)) {
    return state;
  }

  const { nodeIds } = action.payload;
  if (nodeIds.length === 0) {
    return state;
  }

  const nodePositionsById = nodePositionsByNodeIdSelector(appState);

  const copyIds = zipObject(
    nodeIds,
    map(nodeIds, () => uuidV4())
  );

  function nodeIsSelected(id: string): boolean {
    return findIndex(nodeIds, (x) => x === id) !== -1;
  }

  const rootPosition = nodePositionsById[nodeIds[0]];

  const copyNodes: ClipboardNode[] = nodeIds.map((nodeId) => {
    const node = nodeFromNodeIdSelector(appState, nodeId);
    const outputs = nodeOutputSourcesByPinIdFromNodeIdSelector(
      appState,
      nodeId
    );
    const copyNode: ClipboardNode = {
      id: copyIds[nodeId],
      type: "element",
      elementType: node.elementType,
      offset: pointSubtract(nodePositionsById[nodeId], rootPosition),
      outputs: mapValues(outputs, (conns) =>
        conns
          .filter((x) => nodeIsSelected(x.nodeId))
          .map((c) => ({ nodeId: copyIds[c.nodeId], pinId: c.pinId }))
      ),
    };
    return copyNode;
  });

  return {
    ...state,
    clipboardNodes: copyNodes,
    clipboardPasteOrigin: rootPosition,
  };
});
