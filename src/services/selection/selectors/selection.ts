import { createSelector } from "reselect";

import pick from "lodash/pick";

import { nodesByIdSelector } from "@/services/graph/selectors/nodes";

import { createSelectionSelector } from "../utils";
import { SelectionState } from "../state";

export const selectedNodeIdsSelector = createSelectionSelector(state => {
  if (state.selectionType === "nodes") {
    return state.selectedIds;
  }
  return [];
});

export const isNodeSelectedSelector = createSelectionSelector(
  (s: SelectionState, nodeId: string) => {
    if (s.selectionType !== "nodes") {
      return false;
    }
    return s.selectedIds.indexOf(nodeId) !== -1;
  }
);

export const selectedNodesByIdSelector = createSelector(
  nodesByIdSelector,
  selectedNodeIdsSelector,
  (nodesById, selectedNodeIds) => pick(nodesById, selectedNodeIds)
);

export const selectedWireIdsSelector = createSelectionSelector(state => {
  if (state.selectionType === "wires") {
    return state.selectedIds;
  }
  return [];
});

export const isWireSelectedSelector = createSelectionSelector(
  (s: SelectionState, wireId: string) => {
    if (s.selectionType !== "wires") {
      return false;
    }
    return s.selectedIds.indexOf(wireId) !== -1;
  }
);
