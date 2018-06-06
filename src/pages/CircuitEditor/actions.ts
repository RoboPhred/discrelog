import { Action } from "redux";

import { Dispatch } from "react-redux";

import uuidV4 from "uuid/v4";
import { values, zipObject, map } from "lodash-es";

import { Rectangle } from "@/types";
import { GetState } from "@/store";
import { typedKeys } from "@/utils";

import { addNode, wireNode } from "@/services/simulator/actions";

import { selectedNodeIds } from "./selectors";

export type SelectionMode = "set" | "append" | "remove" | "toggle";

export const ACTION_NODE_HOVER = "@editor/node/hover" as "@editor/node/hover";
export const hoverNode = (nodeId: string | null) => ({
  type: ACTION_NODE_HOVER,
  payload: { nodeId }
});
export type HoverNodeAction = ReturnType<typeof hoverNode>;

export const ACTION_MOVE_SELECTED = "@editor/move-selected" as "@editor/move-selected";
export const moveSelected = (offsetX: number, offsetY: number) => ({
  type: ACTION_MOVE_SELECTED,
  payload: { offsetX, offsetY }
});
export type MoveNodeAction = ReturnType<typeof moveSelected>;

export const ACTION_COPY_SELECTED = "@editor/copy-selected" as "@editor/copy-selected";
export const copySelected = () => ({
  type: ACTION_COPY_SELECTED
});
export type CopySelectedAction = ReturnType<typeof copySelected>;

export const ACTION_PASTE = "@editor/paste" as "@editor/paste";
export const paste = () => (dispatch: Dispatch, getState: GetState) => {
  // TODO: Make a cross-cutting reducer for this.
  //  This should not be a thunk, as it can be implemented as a pure action.
  const state = getState();
  const clipboardNodes = state.ui.circuitEditor.clipboardContent;

  const pasteIds = zipObject(
    clipboardNodes.map(x => x.id),
    map(clipboardNodes, () => uuidV4())
  );

  // Two passes: Create and Wire.

  // Create the nodes.
  for (let node of clipboardNodes) {
    const {
      id,
      type,
      offset: { x, y }
    } = node;
    dispatch(addNode(type, x, y, pasteIds[id]));
  }

  // Wire the nodes
  for (let node of clipboardNodes) {
    const { id, outputs } = node;
    const sourceId = pasteIds[id];
    for (let outputPin of typedKeys(outputs)) {
      for (let output of outputs[outputPin]) {
        const { nodeId: targetCopyId, pin: targetPin } = output;
        const targetId = pasteIds[targetCopyId];
        dispatch(wireNode(sourceId, outputPin, targetId, targetPin));
      }
    }

    // Now this is just getting silly.  This really needs to be a real reducer.
    dispatch(selectNodes(values(pasteIds)));
  }
};

export const ACTION_SELECT_NODES = "@editor/select/nodes" as "@editor/select/nodes";
export const selectNodes = (
  nodeId: string | string[],
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_NODES,
  payload: {
    nodeIds: Array.isArray(nodeId) ? nodeId : [nodeId],
    mode
  }
});
export type SelectNodesAction = ReturnType<typeof selectNodes>;

export const ACTION_SELECT_REGION = "@editor/select/region" as "@editor/select/region";
export const selectRegion = (
  region: Rectangle,
  mode: SelectionMode = "set"
) => ({
  type: ACTION_SELECT_REGION,
  payload: {
    region,
    mode
  }
});
export type SelectRegionAction = ReturnType<typeof selectRegion>;

export const ACTION_SELECT_CLEAR = "@editor/select/clear" as "@editor/select/clear";
export const clearSelection = () => ({
  type: ACTION_SELECT_CLEAR
});
export type ClearSelectionAction = ReturnType<typeof clearSelection>;

export type CircuitEditorAction =
  | HoverNodeAction
  | MoveNodeAction
  | CopySelectedAction
  | SelectNodesAction
  | SelectRegionAction
  | ClearSelectionAction;
