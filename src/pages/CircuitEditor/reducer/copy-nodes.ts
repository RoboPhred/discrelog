import produce from "immer";

import uuidV4 from "uuid/v4";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import zipObject from "lodash/zipObject";

import { AppState } from "@/store";
import { pointSubtract } from "@/geometry";

import { CircuitEditorState, defaultCircuitEditorState } from "../state";
import { CopyNodesAction } from "../actions";
import { ClipboardNode } from "../types";

function copyNodesMutator(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: CopyNodesAction,
  appState: AppState
) {
  const { nodeIds } = action.payload;
  const { nodePositions } = state;
  const { nodesById } = appState.services.simulator;

  if (nodeIds.length === 0) {
    return;
  }

  const copyIds = zipObject(
    nodeIds,
    map(nodeIds, () => uuidV4())
  );

  function nodeIsSelected(id: string): boolean {
    return nodeIds.findIndex(x => x === id) !== -1;
  }

  const rootPosition = nodePositions[nodeIds[0]];

  const copyNodes: ClipboardNode[] = nodeIds.map(id => {
    const node = nodesById[id];
    const copyNode: ClipboardNode = {
      id: copyIds[id],
      type: node.type,
      offset: pointSubtract(nodePositions[id], rootPosition),
      outputs: mapValues(node.outputConnectionsByPin, conns =>
        conns
          .filter(x => nodeIsSelected)
          .map(c => ({ nodeId: copyIds[c.nodeId], pin: c.pin }))
      )
    };
    return copyNode;
  });

  state.clipboardContent = copyNodes;
}

export default function copySelectedReduxcer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: CopyNodesAction,
  appState: AppState
) {
  return produce(state, s => copyNodesMutator(s, action, appState));
}
