import { v4 as uuidV4 } from "uuid";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import findIndex from "lodash/findIndex";
import zipObject from "lodash/zipObject";

import { pointSubtract } from "@/geometry";

import { isCopyNodesAction } from "@/actions/clipboard-copy";

import { nodeFromNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { nodeOutputSourcesByPinIdFromNodeIdSelector } from "@/services/node-graph/selectors/pins";
import { nodePositionsByNodeIdSelector } from "@/services/node-layout/selectors/node-positions";
import { connectionIdFromInputPinSelector } from "@/services/node-graph/selectors/connections";
import {
  wireJointIdsFromConnectionIdSelector,
  wireJointPositionFromJointIdSelector,
} from "@/services/node-layout/selectors/wires";

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
      nodeType: node.nodeType,
      offset: pointSubtract(nodePositionsById[nodeId], rootPosition),
      outputs: mapValues(outputs, (pins) =>
        pins
          .filter((x) => nodeIsSelected(x.nodeId))
          .map((pin) => {
            const connId = connectionIdFromInputPinSelector(appState, pin);
            const jointIds = connId
              ? wireJointIdsFromConnectionIdSelector(appState, connId)
              : [];
            const joints = jointIds
              .map((id) => wireJointPositionFromJointIdSelector(appState, id))
              .map((jointPos) => pointSubtract(jointPos, rootPosition));
            return {
              pin: {
                nodeId: copyIds[pin.nodeId],
                pinId: pin.pinId,
              },
              joints,
            };
          })
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
