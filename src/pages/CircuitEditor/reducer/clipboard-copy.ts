import produce from "immer";
import { AnyAction } from "redux";

import uuidV4 from "uuid/v4";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import findIndex from "lodash/findIndex";
import zipObject from "lodash/zipObject";

import { AppState } from "@/store";
import { pointSubtract } from "@/geometry";

import {
  nodeOutputConnectionsByPinSelector,
  nodeSelector
} from "@/services/simulator/selectors";

import { CircuitEditorState, defaultCircuitEditorState } from "../state";
import { ClipboardNode } from "../types";
import { isCopyNodesAction, CopyNodesAction } from "../actions/clipboard-copy";

function copyNodesMutator(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: CopyNodesAction,
  appState: AppState
) {
  const { nodeIds } = action.payload;
  const { nodePositions } = state;

  if (nodeIds.length === 0) {
    return;
  }

  const copyIds = zipObject(
    nodeIds,
    map(nodeIds, () => uuidV4())
  );

  function nodeIsSelected(id: string): boolean {
    return findIndex(nodeIds, x => x === id) !== -1;
  }

  const rootPosition = nodePositions[nodeIds[0]];

  const copyNodes: ClipboardNode[] = nodeIds.map(nodeId => {
    const node = nodeSelector(appState, nodeId);
    const outputs = nodeOutputConnectionsByPinSelector(appState, nodeId);
    const copyNode: ClipboardNode = {
      id: copyIds[nodeId],
      type: node.type,
      offset: pointSubtract(nodePositions[nodeId], rootPosition),
      outputs: mapValues(outputs, conns =>
        conns
          .filter(x => nodeIsSelected(x.nodeId))
          .map(c => ({ nodeId: copyIds[c.nodeId], pin: c.pin }))
      )
    };
    return copyNode;
  });

  state.clipboardContent = copyNodes;
}

export default function copySelectedReduxcer(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: AnyAction,
  appState: AppState
) {
  if (!isCopyNodesAction(action)) {
    return state;
  }
  return produce(state, s => copyNodesMutator(s, action, appState));
}
