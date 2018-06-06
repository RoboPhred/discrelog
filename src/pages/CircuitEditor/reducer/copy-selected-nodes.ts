import produce from "immer";

import { map, mapValues, zipObject } from "lodash-es";
import uuidV4 from "uuid/v4";

import { AppState } from "@/store";
import { pointSubtract } from "@/geometry";
import { typedKeys } from "@/utils";
import { Point } from "@/types";

import { CircuitEditorState, defaultCircuitEditorState } from "../state";
import { CopySelectedAction } from "../actions";
import { selectedNodesById as selectedNodesByIdSelector } from "../selectors";
import { ClipboardNode } from "../types";

function copySelectedMutator(
  state: CircuitEditorState = defaultCircuitEditorState,
  action: CopySelectedAction,
  appState: AppState
) {
  const { selectedNodeIds, nodePositions } = state;
  const { nodesById } = appState.services.simulator;

  if (selectedNodeIds.length === 0) {
    return;
  }

  const copyIds = zipObject(
    selectedNodeIds,
    map(selectedNodeIds, () => uuidV4())
  );

  function nodeIsSelected(id: string): boolean {
    return selectedNodeIds.findIndex(x => x === id) !== -1;
  }

  const rootPosition = nodePositions[selectedNodeIds[0]];

  const copyNodes: ClipboardNode[] = selectedNodeIds.map(id => {
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
  action: CopySelectedAction,
  appState: AppState
) {
  return produce(state, s => copySelectedMutator(s, action, appState));
}
